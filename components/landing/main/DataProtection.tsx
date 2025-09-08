"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProtectionFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ProtectionFeature = ({
  icon,
  title,
  description,
  index,
}: ProtectionFeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 group"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-100 transition-all duration-300">
        <div className="text-green-600 group-hover:text-green-700 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export const DataProtection = () => {
  const { t } = useTranslation();

  const protectionFeatures = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: t(
        "landing.pseudonymization-title",
        "Advanced pseudonymization before AI processing"
      ),
      description: t(
        "landing.pseudonymization-desc",
        "Patient identifiers (names, addresses, phone numbers) are replaced with internal codes. Only your clinic maintains the mapping - our AI never sees original personal data."
      ),
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: t(
        "landing.de-identification-title",
        "Complete de-identification of clinical data"
      ),
      description: t(
        "landing.de-identification-desc",
        "NLP-based entity recognition automatically detects and removes all directly or indirectly identifying information from clinical notes before AI analysis."
      ),
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: t(
        "landing.data-isolation-title",
        "Secure data isolation and sandbox processing"
      ),
      description: t(
        "landing.data-isolation-desc",
        "AI processing occurs in completely isolated environments. Anonymized data never leaves EU borders, and all transformations are logged for compliance audits."
      ),
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: t(
        "landing.reversible-mapping-title",
        "Reversible mapping under clinic control only"
      ),
      description: t(
        "landing.reversible-mapping-desc",
        "Your clinic maintains exclusive control over the mapping between anonymized codes and patient identities. We never have access to this critical link."
      ),
    },
  ];

  const complianceFeatures = [
    {
      name: "GDPR Art. 5(1)(a)",
      description: "Lawfulness & Transparency",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      name: "GDPR Art. 5(1)(c)",
      description: "Data Minimization",
      icon: <Eye className="w-4 h-4" />,
    },
    {
      name: "GDPR Art. 32",
      description: "Security of Processing",
      icon: <Lock className="w-4 h-4" />,
    },
    {
      name: "DPIA",
      description: "Impact Assessment",
      icon: <FileCheck className="w-4 h-4" />,
    },
  ];

  return (
    <section className="py-16 px-6 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6 border border-green-200">
            <Shield className="w-4 h-4" />
            <span className="font-semibold">
              {t("landing.security-badge", "ADVANCED DATA ANONYMIZATION")}
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t(
              "landing.data-protection-title",
              "Zero Patient Identity Exposure to AI"
            )}
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {t(
              "landing.data-protection-subtitle",
              "Our advanced anonymization module ensures AI never sees patient identities. Pseudonymization, de-identification, and secure processing maintain GDPR compliance while enabling intelligent assistance."
            )}
          </p>

          {/* GDPR Compliance Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="text-green-600">{feature.icon}</div>
                <span className="font-semibold text-gray-900 text-sm">
                  {feature.name}
                </span>
                <span className="text-gray-500 text-sm">
                  {feature.description}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="container mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="grid gap-8 md:gap-12">
                {protectionFeatures.map((feature, index) => (
                  <ProtectionFeature
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DataProtection;
