import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import QRCode from 'qrcode';
import { getFirebaseApp, getFirestoreDb } from '../lib/firebase';

const ATTR_KEY = 'trufi_attr_v1';
const EVENT_DEDUPE_MS = 30 * 60 * 1000;

const envRate = Number(import.meta.env.VITE_REFERRAL_COMMISSION_RATE ?? '0.15');
export const REFERRAL_COMMISSION_RATE = Number.isFinite(envRate)
  ? Math.min(1, Math.max(0, envRate))
  : 0.15;

export type ReferralEventType = 'scan' | 'contact_click';
export type ReferralSaleStatus = 'pending' | 'approved' | 'paid';

export interface ReferralProfile {
  uid: string;
  email: string;
  name: string;
  payoutAlias: string;
  referralCode: string;
  commissionRate: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ReferralFlyer {
  id: string;
  ownerUid: string;
  referralCode: string;
  campaign: string;
  status: 'active' | 'retired';
  createdAt?: unknown;
}

export interface ReferralPlacement {
  flyerId: string;
  ownerUid: string;
  label: string;
  note: string;
  lat?: number;
  lng?: number;
  createdAt?: unknown;
}

export interface ReferralEvent {
  id: string;
  flyerId: string;
  ownerUid: string;
  referralCode: string;
  type: ReferralEventType;
  occurredAt: string;
  createdAt?: unknown;
}

export interface ReferralSale {
  id: string;
  flyerId: string;
  ownerUid: string;
  referralCode: string;
  reference: string;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  status: ReferralSaleStatus;
  occurredAt: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ReferralDashboardData {
  flyers: ReferralFlyer[];
  placements: ReferralPlacement[];
  events: ReferralEvent[];
  sales: ReferralSale[];
}

export interface ReferralAdminData extends ReferralDashboardData {
  profiles: ReferralProfile[];
}

function authOrThrow() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase no está configurado para referidos.');
  return getAuth(app);
}

function dbOrThrow() {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firebase no está configurado para referidos.');
  return db;
}

function makeReferralCode(uid: string) {
  const clean = uid.replace(/[^a-z0-9]/gi, '').slice(0, 7).toUpperCase();
  return `REF-${clean || crypto.randomUUID().slice(0, 7).toUpperCase()}`;
}

function makeFlyerId(referralCode: string) {
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `FLY-${referralCode.replace(/^REF-/, '')}-${suffix}`;
}

export function watchReferralAuth(listener: (user: User | null) => void) {
  try {
    return onAuthStateChanged(authOrThrow(), listener);
  } catch {
    listener(null);
    return () => undefined;
  }
}

export function currentReferralUser() {
  try {
    return authOrThrow().currentUser;
  } catch {
    return null;
  }
}

export async function isReferralAdminUser(user = currentReferralUser()) {
  if (!user) return false;
  if ((user.email ?? '').toLowerCase().endsWith('@zengasoft.com')) return true;
  try {
    return (await getDoc(doc(dbOrThrow(), 'referralAdmins', user.uid))).exists();
  } catch {
    return false;
  }
}

export async function signUpReferrer(input: {
  name: string;
  email: string;
  password: string;
  payoutAlias?: string;
}) {
  const auth = authOrThrow();
  const credential = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
  const name = input.name.trim();
  if (name) await updateProfile(credential.user, { displayName: name });
  const profile: ReferralProfile = {
    uid: credential.user.uid,
    email: credential.user.email ?? input.email.trim(),
    name: name || credential.user.email?.split('@')[0] || 'Referidor',
    payoutAlias: input.payoutAlias?.trim() ?? '',
    referralCode: makeReferralCode(credential.user.uid),
    commissionRate: REFERRAL_COMMISSION_RATE,
  };
  await setDoc(doc(dbOrThrow(), 'referralProfiles', credential.user.uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return profile;
}

export async function loginReferrer(email: string, password: string) {
  return (await signInWithEmailAndPassword(authOrThrow(), email.trim(), password)).user;
}

export async function logoutReferrer() {
  await signOut(authOrThrow());
}

export async function getReferralProfile(uid: string): Promise<ReferralProfile | null> {
  const snapshot = await getDoc(doc(dbOrThrow(), 'referralProfiles', uid));
  return snapshot.exists() ? (snapshot.data() as ReferralProfile) : null;
}

export async function saveReferralProfile(profile: ReferralProfile) {
  await setDoc(
    doc(dbOrThrow(), 'referralProfiles', profile.uid),
    { ...profile, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function createReferralFlyer(input: {
  campaign: string;
  locationLabel: string;
  note?: string;
  lat?: number;
  lng?: number;
}) {
  const user = currentReferralUser();
  if (!user) throw new Error('Iniciá sesión para generar un volante.');
  const profile = await getReferralProfile(user.uid);
  if (!profile) throw new Error('No encontramos tu perfil de referidos.');

  const id = makeFlyerId(profile.referralCode);
  const flyer: ReferralFlyer = {
    id,
    ownerUid: user.uid,
    referralCode: profile.referralCode,
    campaign: input.campaign.trim() || 'Volante general',
    status: 'active',
  };
  const placement: ReferralPlacement = {
    flyerId: id,
    ownerUid: user.uid,
    label: input.locationLabel.trim() || 'Sin ubicación',
    note: input.note?.trim() ?? '',
    ...(Number.isFinite(input.lat) ? { lat: input.lat } : {}),
    ...(Number.isFinite(input.lng) ? { lng: input.lng } : {}),
  };

  const db = dbOrThrow();
  await Promise.all([
    setDoc(doc(db, 'referralFlyers', id), { ...flyer, createdAt: serverTimestamp() }),
    setDoc(doc(db, 'referralPlacements', id), { ...placement, createdAt: serverTimestamp() }),
  ]);
  return { flyer, placement };
}

export async function setReferralFlyerStatus(id: string, status: ReferralFlyer['status']) {
  const user = currentReferralUser();
  if (!user) throw new Error('Sesión requerida.');
  await setDoc(
    doc(dbOrThrow(), 'referralFlyers', id),
    { status, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

async function listOwned<T>(collectionName: string, uid: string) {
  const snapshot = await getDocs(query(collection(dbOrThrow(), collectionName), where('ownerUid', '==', uid)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

async function listAll<T>(collectionName: string) {
  const snapshot = await getDocs(collection(dbOrThrow(), collectionName));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

export async function getReferralDashboardData(uid: string): Promise<ReferralDashboardData> {
  const [flyers, placements, events, sales] = await Promise.all([
    listOwned<ReferralFlyer>('referralFlyers', uid),
    listOwned<ReferralPlacement>('referralPlacements', uid),
    listOwned<ReferralEvent>('referralEvents', uid),
    listOwned<ReferralSale>('referralSales', uid),
  ]);
  return {
    flyers,
    placements,
    events: events.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
    sales: sales.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
  };
}

export async function getReferralAdminData(): Promise<ReferralAdminData> {
  if (!await isReferralAdminUser()) throw new Error('Esta cuenta no administra referidos.');
  const [profiles, flyers, placements, events, sales] = await Promise.all([
    listAll<ReferralProfile>('referralProfiles'),
    listAll<ReferralFlyer>('referralFlyers'),
    listAll<ReferralPlacement>('referralPlacements'),
    listAll<ReferralEvent>('referralEvents'),
    listAll<ReferralSale>('referralSales'),
  ]);
  return {
    profiles,
    flyers,
    placements,
    events: events.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
    sales: sales.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
  };
}

export async function createReferralSale(input: {
  flyerId: string;
  amount: number;
  reference?: string;
  status?: ReferralSaleStatus;
}) {
  if (!await isReferralAdminUser()) throw new Error('Permiso de administración requerido.');
  const amount = Math.max(0, Number(input.amount) || 0);
  if (!amount) throw new Error('Ingresá el valor de la venta.');
  const flyer = await getReferralFlyer(input.flyerId);
  if (!flyer) throw new Error('Flyer no encontrado.');
  const profile = await getReferralProfile(flyer.ownerUid);
  if (!profile) throw new Error('Referidor no encontrado.');
  const rate = Number.isFinite(profile.commissionRate) ? profile.commissionRate : REFERRAL_COMMISSION_RATE;
  const id = `SALE-${crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`;
  const sale: ReferralSale = {
    id,
    flyerId: flyer.id,
    ownerUid: flyer.ownerUid,
    referralCode: flyer.referralCode,
    reference: input.reference?.trim() || 'Venta referida',
    amount,
    commissionRate: rate,
    commissionAmount: Math.round(amount * rate),
    status: input.status ?? 'approved',
    occurredAt: new Date().toISOString(),
  };
  await setDoc(doc(dbOrThrow(), 'referralSales', id), {
    ...sale,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return sale;
}

export async function setReferralSaleStatus(id: string, status: ReferralSaleStatus) {
  if (!await isReferralAdminUser()) throw new Error('Permiso de administración requerido.');
  await setDoc(doc(dbOrThrow(), 'referralSales', id), { status, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getReferralFlyer(id: string): Promise<ReferralFlyer | null> {
  const snapshot = await getDoc(doc(dbOrThrow(), 'referralFlyers', id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ReferralFlyer) : null;
}

export async function getReferralPlacement(id: string): Promise<ReferralPlacement | null> {
  const snapshot = await getDoc(doc(dbOrThrow(), 'referralPlacements', id));
  return snapshot.exists() ? ({ flyerId: snapshot.id, ...snapshot.data() } as ReferralPlacement) : null;
}

function dedupeKey(flyerId: string, type: ReferralEventType) {
  return `gatrivi_ref_event:${flyerId}:${type}`;
}

export async function recordReferralEvent(flyer: ReferralFlyer, type: ReferralEventType) {
  if (flyer.status !== 'active') return false;
  const key = dedupeKey(flyer.id, type);
  try {
    const previous = Number(sessionStorage.getItem(key) || '0');
    if (Date.now() - previous < EVENT_DEDUPE_MS) return false;
  } catch {
    // Tracking should never block navigation.
  }

  const occurredAt = new Date().toISOString();
  const eventId = `${flyer.id}-${type}-${crypto.randomUUID()}`;
  await setDoc(doc(dbOrThrow(), 'referralEvents', eventId), {
    flyerId: flyer.id,
    ownerUid: flyer.ownerUid,
    referralCode: flyer.referralCode,
    type,
    occurredAt,
    createdAt: serverTimestamp(),
  });
  try {
    sessionStorage.setItem(key, String(Date.now()));
  } catch {
    // Ignore storage failures.
  }
  return true;
}

function readStoredAttribution(): { ref?: string; flyer?: string } {
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    return raw ? JSON.parse(raw) as { ref?: string; flyer?: string } : {};
  } catch {
    return {};
  }
}

export async function recordAttributedReferralEvent(type: ReferralEventType) {
  const { flyer } = readStoredAttribution();
  if (!flyer) return false;
  const found = await getReferralFlyer(flyer);
  if (!found) return false;
  return recordReferralEvent(found, type);
}

export function referralTargetUrl(flyerId: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tmm.gatrivi.com';
  return `${origin}/r/${encodeURIComponent(flyerId)}`;
}

export async function buildFlyerQrDataUrl(flyerId: string) {
  return QRCode.toDataURL(referralTargetUrl(flyerId), {
    width: 560,
    margin: 1,
    errorCorrectionLevel: 'M',
  });
}
