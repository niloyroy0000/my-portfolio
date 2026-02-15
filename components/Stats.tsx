"use client";
import CountUp from "react-countup";
import type { TimelineEntry, Project, Certification } from "@/types/api";

// Helper function to calculate total experience from timeline
function calculateTotalExperience(timeline: TimelineEntry[]): string {
  if (!timeline || timeline.length === 0) return "0";

  const sortedTimeline = [...timeline].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const firstJob = sortedTimeline[0];
  const yearsOfExperience = new Date().getFullYear() - new Date(firstJob.startDate).getFullYear();

  return `${yearsOfExperience}`;
}

// Helper function to count all unique technologies from projects
function countAllTechnologies(projects: Project[]): number {
  const allTechs = new Set<string>();
  projects.forEach(project => {
    project.stacks.forEach(tech => allTechs.add(tech));
  });
  return allTechs.size;
}

// Helper function to get certification counts
function getCertificationCounts(certifications: Certification[]): { total: number; upcoming: number } {
  const total = certifications.length;
  const upcoming = certifications.filter(cert => cert.isUpcoming === true).length;
  return { total, upcoming };
}

interface StatsProps {
  timeline: TimelineEntry[];
  projects: Project[];
  certifications: Certification[];
}

const Stats = ({ timeline, projects, certifications }: StatsProps) => {
  const totalExperience = calculateTotalExperience(timeline);
  const totalProjects = projects.length;
  const totalTechnologies = countAllTechnologies(projects);
  const certCounts = getCertificationCounts(certifications);

const stats = [
  {
      num: parseInt(totalExperience.replace(/\D/g, '')), // Extract number from string like "9+ years"
      text: "Years of Development Experience",
      suffix: "+", // Makes sense as experience grows over time
      gradient: "from-secondary-default/10 to-blue-500/10",
      borderColor: "border-secondary-default/30",
      textColor: "text-secondary-default",
      testId: "stat-experience",
  },
  {
      num: totalProjects,
      text: "Projects Delivered",
      suffix: "+", // Makes sense as more projects can be added
      gradient: "from-blue-500/10 to-purple-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      testId: "stat-projects",
  },
  {
      num: totalTechnologies,
      text: "Tools & Technologies mastered",
      suffix: "+", // Makes sense as more technologies can be learned
      gradient: "from-purple-500/10 to-secondary-default/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      testId: "stat-technologies",
  },
  {
      num: certCounts.total - certCounts.upcoming,
      text: "Professional Credentials",
      suffix: "+", // Will grow over time
      gradient: "from-emerald-500/10 to-blue-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-300",
      testId: "stat-credentials",
  },
];

  return (
    <section 
      data-testid="stats-section"
      className="pt-4 pb-12 ps-0 pe-0 xl:pt-0 xl:pb-0"
    >
      <div className="container mx-auto ps-0 pe-0">
        <div 
          data-testid="stats-container"
          className="flex flex-wrap gap-6 max-w-[80vw] mx-auto xl:max-w-none"
        >
          {stats.map((item, index) => {
            return (
              <div
                key={index}
                data-testid={item.testId}
                className={`flex-1 flex gap-4 items-center justify-center xl:justify-start bg-gradient-to-br ${item.gradient} backdrop-blur-sm border ${item.borderColor} rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
              >
                <CountUp
                  end={item.num}
                  duration={5}
                  delay={2}
                  suffix={item.suffix}
                  className={`text-4xl xl:text-5xl font-extrabold ${item.textColor}`}
                />
                <p
                  className={`${
                    item.text.length < 15 ? "max-w-[100px]" : "max-w-[150px]"
                  } leading-snug text-white/80`}
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
