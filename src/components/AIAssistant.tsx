import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Zap, Search, FileText, Globe, BarChart3, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

// Multi-language suggestions
const suggestions = [
  { icon: Search, label: "FR", text: "Trouver une archive par contenu" },
  { icon: Globe, label: "EN", text: "Generate English activity report" },
  { icon: FileText, label: "AR", text: "تحليل الملفات المؤرشفة حديثاً" }
];

// Simple language detector based on common words
const detectLanguage = (text: string) => {
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishWords = /\b(how|what|generate|create|find|report|analyze|please|hello)\b/i;
  
  if (arabicRegex.test(text)) return "ar";
  if (englishWords.test(text)) return "en";
  return "fr"; // default
};

// Response templates per language
const aiResponses = {
  ar: [
    "بالتأكيد، أقوم الآن بتحليل قواعد البيانات الخاصة بالأرشيف...",
    "تم العثور على النتائج المطابقة. هل ترغب في إنشاء تقرير مفصل؟",
    "هذا يتطلب صلاحيات إدارية. هل تريد مني تحضير مسودة الطلب؟",
    "تم تنفيذ المهمة بنجاح، بناءً على أحدث البروتوكولات الأمنية."
  ],
  en: [
    "I am analyzing the archive metrics across all zones right now...",
    "I've cross-referenced the documents. Would you like a visualization of the data?",
    "Running deep semantic search on the specific emplacement. Please wait...",
    "Professional summary generated successfully. All data is encrypted and secure."
  ],
  fr: [
    "J'analyse actuellement les métriques réparties sur toutes vos zones d'archivage...",
    "J'ai croisé les données des utilisateurs. Souhaitez-vous générer un tableau de bord ?",
    "Recherche sémantique approfondie en cours. L'IA étudie les correspondances...",
    "Le rapport professionnel a été généré avec succès. Les informations sont sécurisées."
  ]
};

// Simulated professional tasks that the AI "performs"
const ProfessionalActionCard = ({ lang }: { lang: "fr" | "en" | "ar" }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDone(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 15 + 5);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const texts = {
    fr: { title: "Analyse Sémantique", scanning: "Recherche profonde...", done: "Terminé" },
    en: { title: "Semantic Analysis", scanning: "Deep scanning...", done: "Completed" },
    ar: { title: "تحليل دلالي", scanning: "بحث عميق...", done: "مكتمل" }
  };

  const isRtl = lang === "ar";
  const t = texts[lang];

  return (
    <div className={`mt-2 p-3 rounded-xl border border-border bg-background shadow-sm ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">{t.title}</span>
        </div>
        {done ? <CheckCircle2 size={14} className="text-success" /> : <Loader2 size={14} className="text-muted-foreground animate-spin" />}
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-accent" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{done ? t.done : t.scanning}</span>
        <span>{Math.min(progress, 100)}%</span>
      </div>
    </div>
  );
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{id: string; role: "user" | "ai", content: string, lang?: "fr"|"en"|"ar", isAction?: boolean}[]>([
    { id: "1", role: "ai", content: "Bonjour / Hello / مرحباً. \nJe suis le Copilot IA Multilingue. Je peux analyser, générer des rapports et automatiser vos tâches d'archivage.", lang: "fr" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const lang = detectLanguage(text);
    const isRtl = lang === "ar";
    
    setChat(prev => [...prev, { id: Date.now().toString(), role: "user", content: text, lang }]);
    setMessage("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const responses = aiResponses[lang];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Randomly decide if this response should include a professional action card
      const showAction = Math.random() > 0.4;
      
      setChat(prev => [...prev, { 
        id: (Date.now() + 1).toString(),
        role: "ai", 
        content: randomResponse,
        lang,
        isAction: showAction
      }]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-5 w-[380px] max-w-[calc(100vw-2.5rem)] shadow-[0_10px_40px_rgb(0,0,0,0.2)] rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-3xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 100px)", height: "600px" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-primary/15 via-accent/10 to-transparent flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground relative shadow-inner">
                  <Bot size={22} />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card shadow-sm animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-foreground font-heading tracking-tight flex items-center gap-1.5">
                    Mazeraa Copilot AI <Sparkles size={14} className="text-accent" />
                  </h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Globe size={10} className="text-primary" /> Assistant Multilingue Pro
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-colors"
                aria-label="Fermer l'assistant IA"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {chat.map((msg) => {
                const isRtl = msg.lang === "ar";
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    key={msg.id}
                    className={`flex flex-col w-full ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div 
                      dir={isRtl ? "rtl" : "ltr"}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-line leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm" 
                        : "bg-muted/80 text-foreground rounded-bl-sm border border-border/50"
                    }`}>
                      {msg.content}
                      {msg.role === "ai" && msg.isAction && <ProfessionalActionCard lang={msg.lang || "fr"} />}
                      <div className={`text-[9px] mt-1.5 opacity-60 flex items-center gap-1 ${isRtl ? "justify-start" : "justify-end"}`}>
                        {msg.role === "ai" ? <Sparkles size={8} /> : null}
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/80 text-foreground rounded-2xl rounded-bl-sm px-5 py-4 border border-border/50 flex gap-1.5 shadow-sm">
                    <motion.div animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                  </div>
                </div>
              )}

              {chat.length === 1 && !isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-2 mt-4"
                >
                  <p className="text-xs text-muted-foreground font-semibold px-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={12} className="text-accent" /> Capacités Professionnelles
                  </p>
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(s.text)}
                      className="flex items-center gap-3 text-left p-3 text-sm rounded-xl border border-border/60 bg-background/50 hover:bg-muted hover:border-primary/40 transition-all group shadow-sm"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <s.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground transition-colors">{s.label}</span>
                        </div>
                        <span className="text-foreground/90 font-medium line-clamp-1 leading-snug">{s.text}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background/95 backdrop-blur-xl z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(message); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez en Français, English, او بالعربية..."
                  className="w-full h-12 bg-muted/50 rounded-2xl pl-4 pr-14 text-sm outline-none border border-border hover:border-primary/40 focus:border-primary/60 focus:bg-background transition-all shadow-inner"
                  dir="auto"
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="absolute right-1.5 w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 disabled:scale-95 transition-all hover:bg-primary/90 hover:shadow-md hover:scale-105 active:scale-95"
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <ShieldCheck size={10} className="text-success" />
                <p className="text-[10px] text-muted-foreground font-medium">Chiffrement de bout en bout · Modèle IA Sécurisé</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-6 w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-primary/90 to-accent text-primary-foreground shadow-[0_10px_40px_rgb(0,0,0,0.3)] shadow-primary/40 flex items-center justify-center z-50 group border border-white/20"
        aria-label="Ouvrir l'assistant IA"
      >
        <Bot size={26} className="absolute transition-all duration-300 group-hover:scale-110" />
        <Sparkles size={12} className="absolute -top-1 -right-1 text-white animate-pulse" />
        {/* Animated rings around the button */}
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/40 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-x-0 -bottom-2 h-2 bg-black/20 blur-md rounded-full" />
      </motion.button>
    </>
  );
};
