import React from "react";
import { motion } from "framer-motion";
import type { Certification } from "@/types/api";
import SectionHeader from "./SectionHeader";
import CertificationCard from "./CertificationCard";
import { Button } from "./ui/button";
import Link from "next/link";
import { FiArrowRight } from "@/lib/icons";

interface FeaturedCertificationsProps {
  certifications: Certification[];
}

const FeaturedCertifications: React.FC<FeaturedCertificationsProps> = ({ certifications }) => {
  const featuredCerts = certifications.filter(cert => cert.featured === true).slice(0, 3);

  if (featuredCerts.length === 0) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Professional"
          highlightText="Certifications"
          description="Industry credentials and validated expertise"
          className="mb-12 text-center"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {featuredCerts.map((certification) => (
            <CertificationCard
              key={certification._id}
              certification={certification}
            />
          ))}
        </motion.div>
        
        <div className="flex justify-center">
          <Link href="/certifications">
            <Button variant="outline" className="group">
              View All Certifications 
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCertifications; 