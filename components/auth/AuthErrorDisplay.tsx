import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, XCircle, Info } from "lucide-react";

interface AuthErrorDisplayProps {
  error: string | null;
  onClose?: () => void;
  variant?: "default" | "destructive" | "info";
}

export const AuthErrorDisplay = ({
  error,
  onClose,
  variant = "destructive",
}: AuthErrorDisplayProps) => {
  if (!error) return null;

  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Map info variant to default for Alert component
  const alertVariant = variant === "info" ? "default" : variant;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Alert variant={alertVariant} className="mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {getIcon()}
              <AlertDescription className="text-sm leading-relaxed">
                {error}
              </AlertDescription>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close error message"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};
