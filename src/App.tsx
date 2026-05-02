import { useState } from 'react';
import menu from './menu.json';

export default function App() {
  const [cart, setCart] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const add = (p) => {
    setCart([...cart, p]);
    setShowConfirm(false);
  };

  const total = cart.reduce((s, i) => s + i.price, 0);
  const summary = cart.map(c => `${c.name} ($${c.price.toLocaleString()})`).join(', ');
  const waText = encodeURIComponent(`Hola, quiero hacer un pedido: ${summary}. Total: $${total.toLocaleString()} ARS`);
  const waLink = `https://wa.me/5491112345678?text=${waText}`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">🍕 Pizzería</h1>
      
      <div className="space-y-3 mb-8">
        {menu.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-gray-900 rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-400">{p.type} — ${p.price.toLocaleString()}</p>
            </div>
            <button onClick={() => add(p)} className="bg-gray-800 hover:bg-gray-700 text-white w-10 h-10 rounded-lg text-xl transition">+</button>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">🛒 Carrito</h2>
        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm">Vacío</p>
        ) : (
          <ul className="text-sm space-y-1 mb-3">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-lg font-bold mb-4">Total: ${total.toLocaleString()} ARS</p>
        <button 
          onClick={() => setShowConfirm(true)} 
          disabled={!cart.length}
          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500 font-semibold py-3 rounded-xl transition"
        >
          Confirmar
        </button>

        {showConfirm && (
          <div className="mt-4 space-y-3 pt-4 border-t border-gray-800">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Alias para transferir</p>
              <p className="text-xl font-mono font-bold text-green-400">pizzeria.trufi</p>
            </div>
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-green-700 hover:bg-green-600 text-center font-semibold py-3 rounded-xl transition"
            >
              Enviar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
