
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FamilyMember } from '../types';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  childrenList: FamilyMember[];
}

const ChatBot: React.FC<ChatBotProps> = ({ childrenList }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        text: "¡Hola! Soy tu asistente inteligente de la plataforma 'parental'. Estoy aquí para apoyarte en la gestión diaria del cuidado de tu familia. ¿En qué puedo ayudarte hoy?"
      }]);
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const childrenInfo = childrenList.map(c => 
        `- ${c.name}: ${c.age}, ${c.vitals.weight}, ${c.vitals.height}, estado: ${c.status}`
      ).join('\n');

      const systemInstruction = `
        Eres el 'Asistente Parental' de la plataforma digital 'parental'. 
        Tu tono es eficiente, empático, profesional y enfocado en el bienestar familiar. 
        Eres parte de una infraestructura digital diseñada para ayudar a padres y cuidadores.
        
        Datos de la familia:
        ${childrenInfo}

        REGLAS:
        1. Identifícate como parte de 'parental' si te preguntan.
        2. Proporciona ayuda basada en los datos de los miembros de la familia si es relevante.
        3. Siempre aclara que tus respuestas son guías informativas, no diagnósticos médicos profesionales.
        4. Recomienda usar el Directorio de la plataforma si el usuario busca ayuda profesional externa.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction,
          temperature: 0.7,
        },
        history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }))
      });

      const response = await chat.sendMessage({ message: inputText });
      const modelText = response.text || "Lo siento, hubo un problema con la conexión. ¿Podrías repetir tu consulta?";
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Error de conexión con la inteligencia parental. Por favor, intenta de nuevo más tarde." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <div className="p-6 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined icon-filled">smart_toy</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-text-main dark:text-white leading-none tracking-tight">Asistente Parental</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              En línea
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setMessages([])} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Reiniciar chat">
             <span className="material-symbols-outlined">restart_alt</span>
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {msg.role === 'user' ? 'person' : 'smart_toy'}
                  </span>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white dark:bg-surface-dark text-text-main dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-none'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">smart_toy</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 sticky bottom-0">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto relative group"
        >
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu consulta..."
            disabled={isLoading}
            className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-2xl p-4 pr-14 text-sm focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 shadow-inner"
          />
          <button 
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 top-2 size-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all disabled:bg-gray-300 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
        <p className="text-[9px] text-center text-gray-400 mt-4 uppercase font-black tracking-[0.2em]">
          parental • Plataforma de Apoyo Familiar
        </p>
      </div>
    </main>
  );
};

export default ChatBot;
