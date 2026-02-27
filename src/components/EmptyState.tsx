import { motion } from "framer-motion";
import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({ title = "Aucun résultat", message = "Aucun élément ne correspond à votre recherche." }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="p-4 rounded-full bg-muted mb-4">
      <InboxIcon size={28} className="text-muted-foreground" />
    </div>
    <p className="font-semibold text-foreground">{title}</p>
    <p className="text-sm text-muted-foreground mt-1">{message}</p>
  </motion.div>
);

export default EmptyState;
