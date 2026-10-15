'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Copy,
  Check,
  Languages,
  Calendar,
  DollarSign,
  Mail,
  CheckSquare,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';
import { extractTextFromPDF } from '@/lib/pdf-engine';
import {
  analyzeDocumentText,
  chatWithDocumentText,
  translateDocumentText,
  ExtractedInsights,
  ChatMessage,
} from '@/lib/ai-engine';

export function AIChatPanel() {
  const { files } = useToolStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'summary' | 'entities' | 'translate'>('chat');
  const [extractedData, setExtractedData] = useState<{ fullText: string; pages: { pageNumber: number; text: string }[] } | null>(null);
  const [insights, setInsights] = useState<ExtractedInsights | null>(null);
  const [loading, setLoading] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Translation State
  const [targetLang, setTargetLang] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const file = files[0]?.file;

  // Extract PDF text and run initial analysis on file load
  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    async function process() {
      setLoading(true);
      try {
        const textData = await extractTextFromPDF(file);
        if (!isMounted) return;
        setExtractedData(textData);

        const analyzed = analyzeDocumentText(textData.fullText, file.name);
        setInsights(analyzed);

        // Initial welcome message in chat
        setMessages([
          {
            id: 'msg_welcome',
            role: 'assistant',
            content: `¡Hola! He analizado tu documento **"${file.name}"** (${textData.pages.length} páginas, ${analyzed.wordCount} palabras).\n\n` +
              `Puedes preguntarme cualquier duda sobre su contenido, pedirme resúmenes, buscar fechas o comparar secciones.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err) {
        console.error('Error processing document AI:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    process();

    return () => {
      isMounted = false;
    };
  }, [file]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!file) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !extractedData) return;

    const userQuery = inputMessage.trim();
    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatWithDocumentText(userQuery, extractedData.pages, file.name, messages);
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTranslate = async () => {
    if (!extractedData) return;
    setIsTranslating(true);
    try {
      const result = await translateDocumentText(extractedData.fullText, targetLang);
      setTranslatedText(result);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px] animate-in fade-in duration-200">
      {/* Top Header Tabs */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat Interactivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resumen Ejecutivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('entities')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'entities'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Datos Clave</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('translate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'translate'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Traducir</span>
          </button>
        </div>

        {insights && (
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
            {insights.wordCount} palabras • ~{insights.readingTimeMinutes} min lectura
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Analizando contenido del PDF con IA...
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Extrayendo texto semántico, entidades y generando índice de búsqueda.
          </p>
        </div>
      ) : (
        <>
          {/* TAB 1: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purpleBrand-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60 shadow-2xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400">
                            Citas encontradas en el documento:
                          </span>
                          {msg.sources.map((s, sIdx) => (
                            <div key={sIdx} className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                              • Pág. {s.pageNumber}: "{s.quote}"
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 text-[10px] opacity-60 text-right">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
                    <span>Analizando documento y generando respuesta...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe una pregunta sobre el PDF..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purpleBrand-600 text-white hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-brand-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && insights && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    <h4 className="font-bold text-sm text-brand-900 dark:text-brand-200">
                      Resumen Ejecutivo Automatizado
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(insights.executiveSummary, 1)}
                    className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 1 ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {insights.executiveSummary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Puntos Clave y Conclusiones
                </h4>
                <div className="space-y-2">
                  {insights.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY ENTITIES */}
          {activeTab === 'entities' && insights && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.entities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      {ent.label}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {ent.values.map((v, vIdx) => (
                        <span
                          key={vIdx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <span>Acciones Requeridas / Cláusulas Obligatorias</span>
                </h4>
                <div className="space-y-2">
                  {insights.actionItems.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300"
                    >
                      {act}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRANSLATION */}
          {activeTab === 'translate' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Idioma Destino:
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="en">Inglés (English)</option>
                    <option value="es">Español</option>
                    <option value="fr">Francés (Français)</option>
                    <option value="de">Alemán (Deutsch)</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Portugués</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
                >
                  {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                  <span>{isTranslating ? 'Traduciendo...' : 'Traducir documento'}</span>
                </button>
              </div>

              {translatedText ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {translatedText}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <Languages className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">
                    Selecciona el idioma y presiona "Traducir documento" para generar la versión traducida.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
