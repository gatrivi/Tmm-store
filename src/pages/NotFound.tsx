import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-surface-elevated border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <UtensilsCrossed size={32} className="text-text-primary" />
        </div>
        <h1 className="text-6xl font-black text-text-primary mb-2">404</h1>
        <p className="text-lg text-text-secondary mb-8">
          Parece que te perdiste camino a la cocina.
          <br />
          Esta página no existe.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg"
        >
          <ArrowLeft size={18} />
          Volver al menú
        </button>
      </div>
    </div>
  );
}
