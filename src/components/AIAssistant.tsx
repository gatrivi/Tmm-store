import React, { useRef, useState, useEffect } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { usePlan } from '../context/PlanContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CartAction {
  type: 'add_to_cart';
  itemId: string;
  optionId: string;
  qty: number;
}

interface AIAssistantProps {
  onAddToCart?: (itemId: string, optionId: string, qty: number) => void;
}

export function AIAssistant({ onAddToCart }: AIAssistantProps) {
  const { features } = usePlan();
  const { menuItems, siteSettings } = useMenu();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `¡Hola! Soy el asistente de ${siteSettings.brandName || 'la tienda'}. Puedo recomendarte platos, responder preguntas o ayudarte a armar tu pedido.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  if (!features.canUseAI) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          menuItems: menuItems.filter(i => i.available !== false),
          settings: {
            brandName: siteSettings.brandName,
            address: siteSettings.brandAddress,
            whatsapp: siteSettings.whatsappNumber,
          },
          language: language || 'es',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error del asistente');

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      const actions = (data.actions || []) as CartAction[];
      for (const action of actions) {
        if (action.type === 'add_to_cart' && onAddToCart) {
          onAddToCart(action.itemId, action.optionId, action.qty || 1);
        }
      }
    } catch (err) {
      const fallback = siteSettings.whatsappNumber
        ? `No pude procesar tu consulta. Escribinos por WhatsApp al ${siteSettings.whatsappNumber}.`
        : 'No pude procesar tu consulta en este momento. Intentá de nuevo.';
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: err instanceof Error && err.message.includes('API key')
            ? fallback
            : `${fallback} (${err instanceof Error ? err.message : 'error'})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#5FA7A7] text-white px-5 py-3 rounded-full shadow-xl hover:shadow-2xl hover:brightness-110 transition font-bold text-sm"
        aria-label="Asistente IA"
      >
        <Sparkles size={18} />
        Asistente IA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
          <div className="bg-surface-elevated rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh] overflow-hidden border border-border">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-[#5FA7A7] text-white">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={20} />
                Asistente Premium
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#5FA7A7] text-white'
                        : 'bg-surface-muted text-text-primary'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <MessageCircle size={14} className="animate-pulse" />
                  Pensando...
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Preguntá o pedí algo..."
                className="flex-1 border border-border bg-surface-muted rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-text-muted"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-white/10 disabled:text-text-muted text-white p-3 rounded-xl transition"
                aria-label="Enviar"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
