/* eslint-disable react-refresh/only-export-components */
/**
 * @file AdminContext.tsx
 * @description Context para el estado de autenticación del administrador.
 * Gestiona la visibilidad del modal de login y del panel de administración.
 * Las credenciales se validan contra hashes SHA-256 (Web Crypto API).
 * Incluye rate-limiting: 5 intentos fallidos → 60s de bloqueo.
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { sha256 as fallbackSha256 } from 'js-sha256';

/** Hashes SHA-256 pre-computados de las credenciales válidas */
const VALID_USER_HASH = import.meta.env.VITE_ADMIN_USER_HASH || 'b6d1bcb9c9ef2ebceab34f1a553e0dedcc758b6b47440b8258f6b4d0bfe72626';
const VALID_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASS_HASH || '75a7fca82df2599b0f619e3db73352cec8ab7e7651c4fcac253ba4e6505e00ac';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minuto

/** Computa el hash SHA-256 de una cadena. Soporta HTTP local en dispositivos móviles mediante un polyfill. */
async function computeHash(message: string): Promise<string> {
  // Intentar usar Web Crypto API si estamos en un contexto seguro (HTTPS o localhost)
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback silencioso en caso de error
    }
  }
  
  // Polyfill para dispositivos móviles accediendo por HTTP a la red local (192.168.x.x)
  return fallbackSha256(message);
}

interface AdminContextProps {
  /** Si el admin está autenticado */
  isLoggedIn: boolean;
  /** Si el modal de login está visible */
  showLogin: boolean;
  /** Si el panel admin está visible (solo si isLoggedIn) */
  showPanel: boolean;
  /** Mostrar el modal de login (llamado por el patrón secreto del footer) */
  triggerLogin: () => void;
  /** Cerrar el modal de login sin autenticar */
  dismissLogin: () => void;
  /** Intentar autenticarse. Retorna true si exitoso. */
  login: (user: string, password: string) => Promise<boolean>;
  /** Cerrar sesión y el panel */
  logout: () => void;
  /** Número de intentos fallidos consecutivos */
  failedAttempts: number;
  /** Timestamp hasta el cual el login está bloqueado (0 = no bloqueado) */
  lockedUntil: number;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  // Refs para evitar stale closures en el useCallback
  const failedAttemptsRef = useRef(0);
  const lockedUntilRef = useRef(0);

  const triggerLogin = useCallback(() => {
    setShowLogin(true);
  }, []);

  const dismissLogin = useCallback(() => {
    setShowLogin(false);
  }, []);

  const login = useCallback(async (user: string, password: string): Promise<boolean> => {
    try {
      // Check lockout usando ref para valor siempre actualizado
      if (Date.now() < lockedUntilRef.current) return false;

      // NO modificar los strings antes de hashear — usar exactamente lo que escribe el usuario
      const userHash = await computeHash(user);
      const passHash = await computeHash(password);

      if (userHash === VALID_USER_HASH && passHash === VALID_PASSWORD_HASH) {
        setIsLoggedIn(true);
        setShowLogin(false);
        setShowPanel(true);
        failedAttemptsRef.current = 0;
        setFailedAttempts(0);
        setLockedUntil(0);
        lockedUntilRef.current = 0;
        return true;
      }

      // Failed attempt
      failedAttemptsRef.current += 1;
      setFailedAttempts(failedAttemptsRef.current);

      if (failedAttemptsRef.current >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_MS;
        lockedUntilRef.current = lockTime;
        setLockedUntil(lockTime);
        failedAttemptsRef.current = 0;
        setFailedAttempts(0);
      }
      return false;
    } catch (err) {
      console.warn('[AdminContext] Error en login:', err);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setShowPanel(false);
    setShowLogin(false);
  }, []);

  return (
    <AdminContext.Provider value={{
      isLoggedIn,
      showLogin,
      showPanel,
      triggerLogin,
      dismissLogin,
      login,
      logout,
      failedAttempts,
      lockedUntil,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
