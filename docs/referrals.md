# Sistema de referidos

## Alcance MVP

- Cualquier persona puede crear una cuenta en `/referidos` mediante Firebase Auth.
- Cada cuenta recibe un código de referido.
- Cada volante físico recibe un ID único y un QR a `/r/:flyerId`.
- Al crear el volante se registra campaña, ubicación, nota y GPS opcional.
- El QR registra `scan`, conserva `ref` + `flyer` durante la sesión y redirige a la landing.
- Los contactos comerciales atribuidos pasan por `/referido/contact`, registran `contact_click` y luego abren WhatsApp/email.
- El referidor ve scans, contactos, ubicaciones y comisiones.
- `/referidos/admin` permite a administración validar ventas, calcular comisión y marcarla `pending`, `approved` o `paid`.

## Comisión

El MVP crea perfiles con una comisión base del **15%**. Firestore exige 0.15 al alta para impedir que un usuario se asigne una tasa mayor. Un administrador puede cambiar posteriormente la tasa del perfil si el programa comercial define otra.

Antes de producción conviene decidir formalmente la tasa y mantener sincronizados `REFERRAL_COMMISSION_RATE` y la regla de alta.

## Colecciones Firestore

- `referralProfiles/{uid}`: perfil, alias de pago, código y tasa.
- `referralFlyers/{flyerId}`: identidad pública mínima del volante.
- `referralPlacements/{flyerId}`: ubicación/nota/GPS, privada para dueño/admin.
- `referralEvents/{eventId}`: `scan` y `contact_click`.
- `referralSales/{saleId}`: venta validada y comisión; sólo admin escribe.
- `referralAdmins/{uid}`: permite administración explícita adicional.

Una cuenta Firebase Auth con email `@zengasoft.com` también se considera administrativa.

## Activación

1. Habilitar **Email/Password** en Firebase Authentication para el proyecto `tmm-store`.
2. Confirmar las variables Firebase de Vite ya usadas por la app.
3. Desplegar `firestore.rules`.
4. Crear/iniciar sesión con una cuenta `@zengasoft.com` para `/referidos/admin`, o crear manualmente `referralAdmins/{uid}` desde consola/admin SDK.
5. Crear una cuenta de prueba en `/referidos`.
6. Generar un volante, imprimir A6 y escanear el QR desde otro navegador/dispositivo.
7. Verificar que aparezcan scan + contacto y cargar una venta de prueba desde `/referidos/admin`.

## Atribución

El QR termina en:

`/r/FLY-...`

Luego redirige a la landing con:

- `ref`
- `flyer`
- `utm_source=referido`
- `utm_medium=flyer`
- `utm_campaign`

`demoIntake` persiste esos campos en `sessionStorage`, por lo que la atribución acompaña navegación interna y links de intake.

## Seguridad

- El afiliado no puede cambiar su `uid`, código ni tasa de comisión.
- El dueño de un flyer no puede cambiar el propietario ni el código de atribución.
- Una ubicación no puede transferirse a otro dueño/flyer.
- Sólo un administrador puede crear o modificar dinero en `referralSales`.
- Los documentos públicos de flyer no contienen email, alias ni datos de pago.

### Hardening posterior

Los eventos públicos están validados contra un flyer real y el cliente deduplica durante 30 minutos, pero un actor automatizado todavía podría inflar métricas de scans/contactos. Antes de usar esas métricas para pagos automáticos, mover creación de eventos a un endpoint server-side con rate limiting/bot filtering. Las comisiones actuales no dependen automáticamente de esos eventos: requieren una venta validada por admin.
