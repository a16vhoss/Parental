```
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            content: 'Hola 👋 Soy tu asistente parental. ¿En qué puedo ayudarte hoy? Puedo darte consejos sobre crianza, salud básica o explicarte las funciones de la app.',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim() || !API_KEY) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "Eres un asistente virtual experto en crianza y desarrollo infantil para la aplicación 'Guía Parental'. Tu tono es amable, empático y profesional. Proporciona consejos prácticos basados en evidencia, pero siempre recuerda al usuario consultar a un pediatra para temas médicos. Respuestas concisas y fáciles de leer. Si te preguntan sobre la app, ayuda a navegar por las secciones: Alertas Amber, Guías de Desarrollo, Directorio, Perfil del Niño, Calendario de Salud."
            });

            const chat = model.startChat({
                history: messages.filter(m => m.id !== 'welcome').map(m => ({
                    role: m.role,
                    parts: [{ text: m.content }]
                })),
            });

            const result = await chat.sendMessage(inputText);
            const response = await result.response;
            const text = response.text();

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Error calling Gemini:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: "Lo siento, tuve un problema al conectarme con la IA. Por favor verifica tu conexión.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
};

return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        {/* CHAT WINDOW */}
        {isOpen && (
            <div className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white dark:bg-[#1E2322] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-auto">
                {/* HEADER */}
                <div className="p-4 bg-primary text-white flex justify-between items-center bg-gradient-to-r from-primary to-primary-dark">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-sm">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Asistente Parental</h3>
                            <p className="text-xs text-white/80 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></span>
                                En línea con Gemini
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#121716]/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${ msg.role === 'user' ? 'justify-end' : 'justify-start' } `}
                        >
                            <div
                                className={`max - w - [85 %] rounded - 2xl p - 3 text - sm shadow - sm ${
    msg.role === 'user'
    ? 'bg-primary text-white rounded-br-none'
    : 'bg-white dark:bg-[#2A302E] dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
} `}
                            >
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                <p className={`text - [10px] mt - 1 text - right ${ msg.role === 'user' ? 'text-white/70' : 'text-gray-400' } `}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-[#2A302E] rounded-2xl rounded-bl-none p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className="p-3 bg-white dark:bg-[#1E2322] border-t border-gray-100 dark:border-gray-700">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Escribe tu consulta..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-[#2A302E] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isLoading}
                            className="absolute right-2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* FAB TRIGGER */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group flex items - center justify - center w - 14 h - 14 rounded - full shadow - xl transition - all duration - 300 pointer - events - auto ${
    isOpen ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rotate-90' : 'bg-primary text-white hover:scale-110 hover:shadow-primary/30'
} `}
        >
            <span className="material-symbols-outlined text-3xl">
                {isOpen ? 'close' : 'smart_toy'}
            </span>
            {!isOpen && (
                <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Asistente IA
                </span>
            )}
        </button>
    </div>
);
};

export default ChatBot;
