
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface BlogPost {
    id: string;
    title: string;
    content: string; // Markdown or HTML
    image_url?: string;
    author: string;
    created_at: string;
}

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            // Don't show error immediately as table might not exist yet
            if (err.code === '42P01') { // undefined_table
                setError('La tabla de blog no existe. Por favor ejecuta el script SQL.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateDailyPost = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // 1. Generate content with Gemini
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error('Falta la API Key de Gemini (VITE_GEMINI_API_KEY)');

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Escribe un artículo de blog corto (300-400 palabras) sobre un consejo valioso de crianza, salud infantil o desarrollo para padres.
      
      Requisitos:
      - Título: Atractivo y claro.
      - Contenido: Estilo empático, profesional y basado en evidencia. Usa Markdown (negritas, listas).
      - FORMATO DE RESPUESTA: Solo JSON válido.
      Schema: { "title": "Titulo del post", "content": "Contenido en markdown" }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean markdown code blocks if present (e.g. ```json ... ```)
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();

            let aiData;
            try {
                aiData = JSON.parse(text);
            } catch (e) {
                console.error("Error parsing JSON:", text);
                throw new Error("La IA generó una respuesta con formato inválido.");
            }

            // Validate data
            const title = aiData.title || aiData.Title || "Consejo del Día";
            const content = aiData.content || aiData.Content || text; // Fallback to raw text if content missing

            // 2. Insert into Supabase
            const newPost = {
                title: title,
                content: content,
                author: 'Parental AI',
                // Placeholder image based on keywords from title
                image_url: `https://source.unsplash.com/800x600/?parenting,${encodeURIComponent(title.split(' ')[0])}&sig=${Date.now()}`
            };

            const { error: dbError } = await supabase
                .from('blog_posts')
                .insert([newPost]);

            if (dbError) throw dbError;

            // 3. Refresh list
            await fetchPosts();

        } catch (err: any) {
            console.error('Error generating post:', err);
            setError(err.message || 'Error generando el post. Verifica tu API Key.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Left Column: Post List */}
            <div className={`w-full lg:w-[400px] xl:w-[450px] h-full flex flex-col bg-white dark:bg-surface-dark shadow-xl z-20 border-r border-gray-100 dark:border-gray-800 ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-black text-text-main dark:text-white tracking-tight">
                            Blog Parental
                        </h1>
                        <button
                            onClick={handleGenerateDailyPost}
                            disabled={isGenerating}
                            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="Simular Automatización Diaria"
                        >
                            {isGenerating ? (
                                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            )}
                            {isGenerating ? 'Generando...' : 'Generar Post'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Consejos diarios impulsados por IA</p>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="text-center py-10 opacity-50">Cargando artículos...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 opacity-50 flex flex-col items-center">
                            <span className="material-symbols-outlined text-4xl mb-2">article</span>
                            <p>No hay artículos aún.</p>
                            <p className="text-xs mt-1">¡Genera el primero con IA!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <article
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:border-primary/30 ${selectedPost?.id === post.id ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-gray-50 dark:bg-background-dark border-transparent'}`}
                            >
                                <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {post.title}
                                </h3>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">
                                        {post.author}
                                        <span className="material-symbols-outlined text-[12px] text-primary">verified</span>
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Content */}
            <div className={`flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-background-dark p-6 lg:p-12 ${!selectedPost ? 'hidden lg:block' : 'block'}`}>
                {selectedPost ? (
                    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="lg:hidden mb-4 flex items-center gap-1 text-gray-500 hover:text-primary font-bold text-xs uppercase tracking-widest"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Regresar
                        </button>

                        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-xl overflow-hidden">
                            {selectedPost.image_url && (
                                <div className="h-64 w-full overflow-hidden relative">
                                    <img
                                        src={selectedPost.image_url}
                                        alt={selectedPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">
                                            Consejo del día
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8 lg:p-12">
                                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                    {selectedPost.title}
                                </h1>

                                <div className="prose prose-lg dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-headings:font-bold prose-a:text-primary max-w-none">
                                    {/* Simple markdown rendering for demo - in prod use a library like react-markdown */}
                                    {selectedPost.content.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4">{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <span className="material-symbols-outlined text-9xl mb-4">auto_stories</span>
                        <p className="text-2xl font-black">Selecciona un artículo</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Blog;
