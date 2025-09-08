"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { KeyValueItem } from "./KeyValueItem";

export const KeyValue = () => {
  const { t } = useTranslation();

  const keyValueItems = [
    {
      icon: "🚀",
      title: t(
        "landing.ai-powered-title",
        "Powered by Artificial Intelligence"
      ),
      description: t(
        "landing.ai-powered-desc",
        "Let AI handle the paperwork. Our system helps you generate patient summaries, recommendations, and clinical notes — instantly."
      ),
    },
    {
      icon: "🔐",
      title: t("landing.gdpr-compliant-title", "Fully GDPR-Compliant"),
      description: t(
        "landing.gdpr-compliant-desc",
        "We never share patient data with third parties. All AI features operate on anonymized inputs, fully compliant with European data protection laws."
      ),
    },
    {
      icon: "⏱",
      title: t("landing.save-time-title", "Save Time, Focus on Care"),
      description: t(
        "landing.save-time-desc",
        "No more redundant documentation. Automate follow-ups, create visit templates, and streamline appointment scheduling."
      ),
    },
    {
      icon: "🛡",
      title: t("landing.security-title", "Built-In Security by Design"),
      description: t(
        "landing.security-desc",
        "Data is encrypted, backed up, and hosted on secure European servers. Your clinic's privacy is always protected."
      ),
    },
  ];

  return (
    <section
      className="py-12 md:py-16 lg:py-20 bg-gray-50"
      aria-labelledby="key-value-title"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2
            id="key-value-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("landing.key-value-title", "Why Choose Our Dental CRM")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t(
              "landing.key-value-subtitle",
              "Our platform combines powerful features with ease of use to transform your dental practice"
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {keyValueItems.map((item, index) => (
            <KeyValueItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyValue;
