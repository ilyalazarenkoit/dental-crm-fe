"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  CheckCircle,
  UserCheck,
  Stethoscope,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const AIFeature = ({ icon, title, description, index }: AIFeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 group"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-50 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-100 transition-all duration-300">
        <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export const AIAssistant = () => {
  const { t } = useTranslation();

  const aiFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: t(
        "landing.ai-drafts-title",
        "AI generates drafts only - doctors decide"
      ),
      description: t(
        "landing.ai-drafts-desc",
        "Our AI creates draft visit notes and recommendations that require mandatory doctor review and approval. No clinical decisions are made automatically - you remain in full control."
      ),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t("landing.draft-workflow-title", "Complete draft-based workflow"),
      description: t(
        "landing.draft-workflow-desc",
        "Every AI suggestion appears as a draft that doctors can review, edit, and approve. Nothing gets saved to patient records without explicit medical professional confirmation."
      ),
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: t(
        "landing.human-control-title",
        "Human-in-the-loop workflow guaranteed"
      ),
      description: t(
        "landing.human-control-desc",
        "Every AI-generated draft requires explicit doctor confirmation before saving. Multi-factor authentication and role-based permissions ensure only authorized medical professionals can approve content."
      ),
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: t(
        "landing.administrative-only-title",
        "Administrative assistant, not diagnostic tool"
      ),
      description: t(
        "landing.administrative-only-desc",
        "Our AI operates strictly as an administrative assistant. It helps with documentation and scheduling but never makes clinical decisions or provides medical diagnoses."
      ),
    },
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "AI Analyzes",
      description:
        "The system securely processes anonymized visit data to understand the context of the appointment.",
    },
    {
      step: "2",
      title: "Draft Created",
      description:
        "AI generates a structured draft of the medical record, including performed procedures and key details.",
    },
    {
      step: "3",
      title: "Doctor Reviews",
      description:
        "The medical professional quickly reviews the draft, making edits if needed.",
    },
    {
      step: "4",
      title: "Final Approval",
      description:
        "The doctor confirms and saves the finalized patient record with just one click.",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* AI Badge */}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t("landing.ai-assistant-title", "AI Assists, Doctors Decide")}
          </h2>

          <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6 border border-blue-200">
            <Brain className="w-4 h-4" />
            <span className="font-semibold">
              {t("landing.ai-badge", "ASSISTIVE AI - DOCTOR CONTROLLED")}
            </span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
          {/* Workflow Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12">
            {workflowSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group h-full"
                >
                  <Card className="bg-gradient-to-b from-gray-50/50 to-white backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="p-4 sm:p-5 lg:p-6 h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex flex-col relative">
                      {/* Step number - responsive positioning and sizing */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
                        {step.step}
                      </div>

                      {/* Title - mobile lower, desktop fixed */}
                      <div className="absolute top-10 sm:top-20  lg:top-16 left-0 right-0 px-2">
                        <h3 className="font-bold text-gray-900 text-2xl sm:text-xl lg:text-lg xl:text-xl text-center leading-tight max-w-full">
                          {step.title}
                        </h3>
                      </div>

                      {/* Description - mobile higher, desktop at bottom */}
                      <div className="absolute bottom-8 sm:bottom-10 lg:bottom-6 left-0 right-0 px-2">
                        <p className="text-gray-700 text-md sm:text-sm lg:text-base font-medium leading-relaxed text-center">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Horizontal arrows - only between cards in same row */}
                {(index + 1) % 4 !== 0 && index < workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="absolute top-1/2 -right-2 sm:-right-2.5 lg:-right-3 transform -translate-y-1/2 z-10 hidden sm:block lg:block"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-blue-500" />
                    </div>
                  </motion.div>
                )}

                {/* Vertical arrows for mobile - between all cards */}
                {index < workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10 sm:hidden"
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 rotate-90">
                      <ArrowRight className="w-3 h-3 text-blue-500" />
                    </div>
                  </motion.div>
                )}

                {/* Vertical arrows for tablet - between rows */}
                {index === 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 transform -translate-x-1/2 z-10 hidden sm:block lg:hidden"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 rotate-90">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-b from-gray-50/50 to-white backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="grid gap-8 md:gap-12">
                {aiFeatures.map((feature, index) => (
                  <AIFeature
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    index={index}
                  />
                ))}
              </div>

              {/* Trust Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 pt-8 border-t border-gray-100 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>
                    {t(
                      "landing.ai-footer",
                      "Administrative tool only - Not for medical diagnosis"
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-400 max-w-2xl mx-auto">
                  {t(
                    "landing.ai-disclaimer",
                    "Our AI operates as an administrative assistant only. All clinical decisions require doctor approval. We operate outside Medical Device Regulation (MDR) scope as a non-diagnostic tool."
                  )}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;
