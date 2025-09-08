"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="group relative cursor-pointer h-full border-0 bg-gradient-to-b from-gray-50/50 to-white backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-b hover:from-gray-100/50 hover:to-white/90 hover:-translate-y-1">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-purple-500/30 group-hover:via-cyan-500/25 group-hover:to-teal-400/30 transition-all duration-700 ease-out">
              {icon}
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-center relative">
            <span className="text-gray-900 transition-opacity duration-700 ease-out group-hover:opacity-0">
              {title}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 bg-clip-text text-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-lg text-gray-600 leading-relaxed text-center">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: "📅",
      title: t("landing.feature-calendar-title", "Smart Appointment Calendar"),
      description: t(
        "landing.feature-calendar-desc",
        "Intelligent scheduling system with real-time availability, automated reminders, and seamless patient booking experience."
      ),
    },
    {
      icon: "📄",
      title: t("landing.feature-ai-notes-title", "AI-Powered Visit Notes"),
      description: t(
        "landing.feature-ai-notes-desc",
        "Generate comprehensive patient summaries, treatment recommendations, and clinical notes instantly with our advanced AI technology."
      ),
    },
    {
      icon: "👥",
      title: t("landing.feature-patient-mgmt-title", "Easy Patient Management"),
      description: t(
        "landing.feature-patient-mgmt-desc",
        "Organize patient records with powerful search, custom tagging, and complete medical history tracking in one intuitive interface."
      ),
    },
    {
      icon: "📈",
      title: t("landing.feature-analytics-title", "Performance Analytics"),
      description: t(
        "landing.feature-analytics-desc",
        "Gain valuable insights into your clinic's performance with customizable dashboards, financial reports, and patient satisfaction metrics."
      ),
    },
    {
      icon: "🧠",
      title: t("landing.feature-suggestions-title", "Intelligent Suggestions"),
      description: t(
        "landing.feature-suggestions-desc",
        "Receive AI-driven recommendations for treatments, follow-ups, and patient communications based on clinical data and best practices."
      ),
    },
  ];

  return (
    <section
      className="py-12 md:py-16 lg:py-20 bg-white"
      aria-labelledby="features-title"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {t("landing.features-tag", "POWERFUL FEATURES")}
          </div>
          <h2
            id="features-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            {t(
              "landing.features-title",
              "Everything You Need for Your Dental Practice"
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t(
              "landing.features-subtitle",
              "Our comprehensive suite of tools streamlines your workflow, enhances patient care, and boosts your practice efficiency."
            )}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-8 py-4 rounded-lg bg-primary text-white text-center font-medium hover:bg-primary/90 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
          >
            {t("landing.explore-all-features", "Explore All Features")}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
