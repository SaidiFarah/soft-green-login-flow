import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Lightbulb, TrendingUp, AlertTriangle, Archive, Sparkles, ChevronRight } from "lucide-react";

// Mock AI Insights Data
const insights = [
  {
    id: 1,
    type: "warning",
    icon: AlertTriangle,
    title: "Alerte de Saturation",
    message: "La Zone A est proche de sa capacité maximale (85%). Envisagez un transfert vers la Zone C.",
    color: "danger",
    gradient: "from-destructive/20 to-destructive/5"
  },
  {
    id: 2,
    type: "trend",
    icon: TrendingUp,
    title: "Tendance d'Activité",
    message: "Une augmentation de 15% des sorties a été détectée cette semaine dans les archives administratives.",
    color: "success",
    gradient: "from-success/20 to-success/5"
  },
  {
    id: 3,
    type: "info",
    icon: Archive,
    title: "Archives les plus consultées",
    message: "Les dossiers de type 'Ressources Humaines' (RH-2023) sont les plus consultés ce mois-ci.",
    color: "info",
    gradient: "from-info/20 to-info/5"
  }
];

const colorClasses = {
  danger: "text-destructive border-destructive/30 bg-destructive/10",
  success: "text-success border-success/30 bg-success/10",
  info: "text-info border-info/30 bg-info/10",
  primary: "text-primary border-primary/30 bg-primary/10",
};

// 3D Animated Card Component
const InsightCard3D = ({ insight, index }: { insight: typeof insights[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, type: "spring", stiffness: 100 }}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={`relative w-full h-full p-6 rounded-2xl border border-border/50 bg-card shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm overflow-hidden group cursor-pointer`}
    >
      {/* 3D Background Gradient Glow */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${insight.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} 
        style={{ transform: "translateZ(-20px)" }}
      />
      
      {/* 3D Content Container */}
      <div className="relative z-10 flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Header with 3D floating icon */}
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={`p-3 rounded-xl border ${colorClasses[insight.color as keyof typeof colorClasses]} flex items-center justify-center`}
            style={{ transform: "translateZ(30px)" }}
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
          >
            <insight.icon size={22} className="drop-shadow-md" />
          </motion.div>
          <div className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-md" style={{ transform: "translateZ(10px)" }}>
            IA Généré
          </div>
        </div>

        {/* Title & Message */}
        <h4 className="text-base font-bold text-foreground mb-2 font-heading leading-tight" style={{ transform: "translateZ(20px)" }}>
          {insight.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1" style={{ transform: "translateZ(15px)" }}>
          {insight.message}
        </p>

        {/* Action link */}
        <div className="mt-5 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" style={{ transform: "translateZ(25px)" }}>
          Agir maintenant <ChevronRight size={14} className="ml-1" />
        </div>
      </div>
      
      {/* Ambient particles for 3D effect */}
      <motion.div 
        animate={{ y: [0, -10, 0], opacity: [0, 0.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
        className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-white blur-[1px]" 
        style={{ transform: "translateZ(40px)" }}
      />
    </motion.div>
  );
};

export const InsightsIA = () => {
  return (
    <div className="w-full mt-2 mb-8 perspective-[1200px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/20">
          <Lightbulb size={16} className="text-white relative z-10" />
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-lg border border-dashed border-white/40"
          />
        </div>
        <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-1.5">
          Insights IA <Sparkles size={14} className="text-accent animate-pulse" />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {insights.map((insight, index) => (
          <InsightCard3D key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </div>
  );
};

export default InsightsIA;
