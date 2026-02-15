"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaHome, FaArrowLeft } from "@/lib/icons";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-default/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-8xl xl:text-9xl font-bold text-secondary-default/20 mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-secondary-default mx-auto rounded-full" />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. 
              Don&apos;t worry, let&apos;s get you back on track!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="lg"
              className="group border-secondary-default/50 text-secondary-default hover:bg-secondary-default hover:text-primary transition-all duration-300"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </Button>
            
            <Link href="/">
              <Button
                size="lg"
                className="bg-secondary-default text-primary hover:bg-secondary-default/90 transition-all duration-300 hover:scale-105"
              >
                <FaHome className="mr-2" />
                Home Page
              </Button>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="border-t border-white/10 pt-8"
          >
            <p className="text-white/60 mb-4">Or explore these sections:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/projects" 
                className="text-secondary-default hover:text-secondary-default/80 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Projects
              </Link>
              <Link 
                href="/skills" 
                className="text-secondary-default hover:text-secondary-default/80 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Skills
              </Link>
              <Link 
                href="/career" 
                className="text-secondary-default hover:text-secondary-default/80 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Career
              </Link>
              <Link 
                href="/certifications" 
                className="text-secondary-default hover:text-secondary-default/80 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Certifications
              </Link>
              <Link 
                href="/contact" 
                className="text-secondary-default hover:text-secondary-default/80 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound; 