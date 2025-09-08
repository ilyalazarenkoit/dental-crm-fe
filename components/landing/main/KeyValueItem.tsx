"use client";

import { motion } from "framer-motion";

interface KeyValueItemProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

export const KeyValueItem = ({
  icon,
  title,
  description,
  delay = 0,
}: KeyValueItemProps) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="text-4xl text-primary mb-2 md:mb-0">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};
