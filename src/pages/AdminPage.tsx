import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { usePlan } from '../context/PlanContext';
import { AdminPanel } from '../components/admin/AdminPanel';
import { LoginModal } from '../components/admin/LoginModal';
import { resolveStorefrontPath } from '../utils/clientSetup';

export default function AdminPage() {
  const { isLoggedIn, showLogin, triggerLogin } = useAdmin();
  const { tenantId } = usePlan();
  const navigate = useNavigate();
  const storePath = resolveStorefrontPath(tenantId);

  useEffect(() => {
    if (!isLoggedIn && !showLogin) {
      triggerLogin();
    }
  }, [isLoggedIn, showLogin, triggerLogin]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <LoginModal />
      <AdminPanel />
      
      {!isLoggedIn && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate(storePath)} 
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ← Volver a la tienda
          </button>
        </div>
      )}
    </div>
  );
}
