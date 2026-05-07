/**
 * @file LoginModal.tsx
 * @description Modal de login para el panel de administración.
 * Aparece sobre un overlay con backdrop-blur cuando el patrón secreto
 * de clicks en el footer se completa exitosamente.
 * Incluye: toggle de visibilidad de contraseña, feedback de rate-limiting.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export function LoginModal() {
  const { showLogin, dismissLogin, login, failedAttempts, lockedUntil } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLogin]);

  // Countdown timer para lockout
  useEffect(() => {
    if (lockedUntil <= Date.now()) {
      setLockCountdown(0);
      return;
    }
    const update = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLockCountdown(remaining > 0 ? remaining : 0);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (lockCountdown > 0) {
      setError(`Demasiados intentos. Espera ${lockCountdown}s.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(username, password);

      if (!success) {
        if (failedAttempts + 1 >= 5) {
          setError('Demasiados intentos. Bloqueado por 1 minuto.');
        } else {
          setError('Usuario o contraseña incorrectos');
        }
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      } else {
        setUsername('');
        setPassword('');
        setShowPassword(false);
      }
    } catch {
      setError('Error interno. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      dismissLogin();
      setUsername('');
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  };

  const handleClose = () => {
    dismissLogin();
    setUsername('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const isLocked = lockCountdown > 0;

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-10000 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={isShaking
              ? { opacity: 1, scale: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }
              : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm bg-brand-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header con logo */}
            <div className="bg-brand-green px-6 py-8 flex flex-col items-center relative">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
              <img
                src="/titulo-blanco.png"
                alt="El Puestito del Tío"
                className="w-48 h-auto object-contain"
              />
              <div className="w-12 h-0.5 bg-white/30 rounded-full mt-4" />
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-6 py-8 flex flex-col gap-4">
              {/* Campo usuario */}
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray/50 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Usuario"
                  maxLength={80}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-100 rounded-xl text-sm font-medium text-brand-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow disabled:opacity-50"
                  autoComplete="off"
                  autoFocus
                  disabled={isLocked || isSubmitting}
                />
              </div>

              {/* Campo contraseña con ojo */}
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray/50 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Contraseña"
                  maxLength={80}
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-100 rounded-xl text-sm font-medium text-brand-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow disabled:opacity-50"
                  autoComplete="current-password"
                  disabled={isLocked || isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-gray/40 hover:text-brand-gray/70 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-500 text-xs font-bold text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLocked || isSubmitting}
                className="w-full py-3.5 bg-brand-green text-white font-bold text-sm rounded-full hover:brightness-90 active:scale-[0.97] transition-all mt-2 shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verificando...' : isLocked ? `Bloqueado (${lockCountdown}s)` : 'Ingresar'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
