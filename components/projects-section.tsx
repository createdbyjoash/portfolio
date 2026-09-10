'use client';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { SectionHeading } from '@/components/ui/section-heading';
import { IconBadge } from '@/components/ui/icon-badge';
import { SurfaceCard } from '@/components/ui/surface-card';

type Project = {
  id: string;
  title: string;
  description: string;
  image?: string | { url?: string } | any;
  technologies: string[];
  liveUrl?: string;
  liveLink?: string;
  githubUrl?: string;
  githubLink?: string;
  featured?: boolean;
};
export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        const data = await res.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const allProjects = Array.isArray(projects) ? projects : [];

  return (
    <section ref={ref} className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, #5d21da 25%, transparent 25%), linear-gradient(-45deg, #5d21da 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #5d21da 75%), linear-gradient(-45deg, transparent 75%, #5d21da 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SectionHeading kicker="Portfolio" title="Featured Projects" className="mb-6" />
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A showcase of my recent work and creative solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              className="group"
            >
              <SurfaceCard className="overflow-hidden">
                <div className="relative overflow-hidden">
                  {project.image ? (
                    <img
                      src={typeof project.image === 'string' ? project.image : project.image.url}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-[#1c1530] to-[#120d20]">
                      <IconBadge size="lg">
                        <span className="text-3xl font-bold text-white">
                          {project.title.charAt(0)}
                        </span>
                      </IconBadge>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-semibold group-hover:text-brand-lighter transition-colors duration-300">
                    {project.title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-slate-700 text-slate-300 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    {(project.liveUrl || project.liveLink) && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-brand hover:bg-brand-dark text-white flex-1"
                      >
                        <a href={project.liveUrl || project.liveLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {(project.githubUrl || project.githubLink) && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-1"
                      >
                        <a href={project.githubUrl || project.githubLink} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </SurfaceCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}