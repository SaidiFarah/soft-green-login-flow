interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

const variantClasses = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
};

const StatusBadge = ({ status, variant = "neutral" }: StatusBadgeProps) => (
  <span className={`badge-status ${variantClasses[variant]}`}>{status}</span>
);

export default StatusBadge;
