"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpinnerGap } from "phosphor-react";

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

/**
 * Full-screen loader component with animation
 */
export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isLoading,
  message = "Loading...",
}) => {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col items-center justify-center p-8 rounded-lg bg-background shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mb-4"
            >
              <SpinnerGap size={48} weight="bold" className="text-primary" />
            </motion.div>
            <p className="text-lg font-medium text-center">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
