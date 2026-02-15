import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Niloy Kumar Barman - Full-Stack .NET Developer",
  description: "Professional portfolio of Niloy Kumar Barman, a skilled Full-Stack .NET Developer with 10+ years experience in building modern web applications and cloud solutions.",
  keywords: [
    "Niloy Kumar Barman",
    "Full-Stack Developer", 
    ".NET Developer",
    "React Developer",
    "Azure Developer",
    "AWS Developer",
    "DevOps Engineer",
    "Software Engineer",
    "Microsoft Certified",
    "Azure Certification",
    "Projects",
    "Software Development",
    "Web Development",
    "Cloud Solutions",
    "Dhaka Bangladesh"
  ],
  openGraph: {
    title: "Niloy Kumar Barman - Full-Stack .NET Developer",
    description: "Professional portfolio showcasing 10+ years of experience in .NET, React, and cloud technologies",
    url: "https://biswajitpanday.github.io",
  },
  twitter: {
    title: "Niloy Kumar Barman - Full-Stack .NET Developer",
    description: "Professional portfolio showcasing 10+ years of experience in .NET, React, and cloud technologies",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 