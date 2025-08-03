import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export const RegisterPresentation = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 856);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.6,
      },
    },
  };

  return (
    <motion.div
      className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      ></motion.div>
      <div className="relative z-20 flex flex-col p-12 text-white w-full">
        <motion.div
          className={clsx(
            "flex items-center justify-center gap-3",
            isMobile ? "mb-4" : "mb-8"
          )}
          variants={itemVariants}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-auto flex-shrink-0 flex items-center">
              <Image
                src={
                  isMobile
                    ? "/images/logo_presentation_tab.svg"
                    : "/images/logo_presentation_desk.svg"
                }
                alt="DentalCRM Logo"
                width={300}
                height={30}
                className="w-auto filter brightness(0) invert(1)"
                style={{
                  height: "clamp(2.25rem, min(5.5vw, 5.5vh), 3.5rem)",
                }}
                priority
              />
            </div>
          </Link>
        </motion.div>
        <div className="max-w-md mx-auto text-center mb-8">
          <motion.h2
            className="text-3xl font-bold mb-4"
            variants={itemVariants}
          >
            {t("register.register-presentation.title")}
          </motion.h2>
          <motion.p className="text-lg opacity-90 mb-6" variants={itemVariants}>
            {t("register.register-presentation.register-banner-text")}
          </motion.p>

          <motion.div
            variants={imageVariants}
            animate="visible"
            initial="hidden"
          >
            <Image
              src="/images/presentation_register.png"
              alt="Register Presentation"
              width={300}
              height={400}
              className="rounded-lg shadow-lg mx-auto"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
