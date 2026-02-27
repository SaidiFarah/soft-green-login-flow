import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  color: "primary" | "accent" | "info" | "destructive" | "success" | "warning";
  index?: number;
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const changeColorMap = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

const KpiCard = ({ title, value, icon: Icon, change, changeType = "up", color, index = 0 }: KpiCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
    className="section-card p-5 hover:card-elevated-hover transition-shadow duration-200"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      {change && (
        <span className={`text-xs font-semibold ${changeColorMap[changeType]}`}>
          {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
    <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
  </motion.div>
);

export default KpiCard;
