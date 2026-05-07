import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Send, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
// IMPORTANT: Adjust this path to wherever MenuContext actually lives!
import { useMenu } from '../context/MenuContext'; 
import { resolveImagesForProduct } from '../utils/imageLoader'; 

export default function App() {
  // Pull the live, admin-editable data from Context instead of hardcoded arrays!
  const { menuItems } = useMenu(); 
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5491131844469"; 
  const BANK_ALIAS = import.meta.env.VITE_BANK_ALIAS || "ELPUESTITOdeltio.MP";

  const addToCart = (item, option) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.optionId === option.id);
      if (existing) {
        return prev.map(i => i.id === item.id && i.optionId === option.id 
          ? { ...i, qty: i.qty + 1 } 
          : i
        );
      }
      return [...prev, { 
        id: item.id, 
        name: item.name, 
        optionId: option.id,
        optionLabel: option.label, 
        price: option.price, 
        qty: 1 
      }];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    
    let message = `Hola El Puestito! 👋\nQuiero hacer el siguiente pedido:\n\n`;
    cart.forEach(item => {
      message += `🔸 ${item.qty}x ${item.name} (${item.optionLabel}) - $${item.price * item.qty}\n`;
    });
    message += `\n*Total: $${total}*\n`;
    message += `\nPago por transferencia al alias: ${BANK_ALIAS}\n¡Gracias!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  // Safe fallback while context loads
  if (!menuItems || menuItems.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading Menu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-black text-white p-6 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">El Puestito del Tío</h1>
          <p className="text-sm text-gray-300">Open 24/7 • 4045 Dorrego Ave</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Dynamic Menu Grid */}
      <main className="max-w-5xl mx-auto p-4 space-y-8 mt-6">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map(item => {
              const images = resolveImagesForProduct(item);
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  
                  {/* Image Section - Using the first image from the array */}
                  {images && images.length > 0 ? (
                    <img 
                      src={images[0]} 
                      alt={item.name} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mt-auto">
                      {item.options.map((opt) => (
                        <div key={opt.id} className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{opt.label}</span>
                            {opt.features && (
                              <span className="text-xs text-gray-400">{opt.features.join(', ')}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-green-600">${opt.price}</span>
                            <button 
                              onClick={() => addToCart(item, opt)}
                              className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition shadow-sm"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Secret Admin Footer */}
      <footer className="w-full text-center pb-8 pt-4 opacity-20 hover:opacity-100 transition-opacity">
        <Link to="/admin" className="text-gray-500 hover:text-gray-800 inline-block p-4" aria-label="Admin Access">
          <Lock size={16} />
        </Link>
      </footer>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">Your cart is empty</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.optionLabel} x{item.qty}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">${item.price * item.qty}</span>
                      <button onClick={() => removeFromCart(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center text-xl font-black mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={checkoutWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg"
              >
                <Send size={20} />
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
