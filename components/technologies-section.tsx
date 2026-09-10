'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { api, Technology } from '@/lib/api';
import { toast } from 'sonner';
import { SectionHeading } from '@/components/ui/section-heading';
import { IconBadge } from '@/components/ui/icon-badge';
import { SurfaceCard } from '@/components/ui/surface-card';

export default function TechnologiesSection() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTechnologies();
        // backend returns { success: true, technologies: [...] }
        if (Array.isArray(data)) setTechnologies(data as Technology[]);
        else if (data && Array.isArray((data as any).technologies)) setTechnologies((data as any).technologies);
        else setTechnologies([]);
      } catch (err) {
        console.error('Failed to fetch technologies', err);
        toast.error('Failed to load technologies');
        setTechnologies([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const fallback: Technology[] = [
    { id: '1', name: 'React', icon: '/icons/react.svg', category: 'Frontend' },
    { id: '2', name: 'Node.js', icon: '/icons/nodejs.svg', category: 'Backend' },
    { id: '3', name: 'TypeScript', icon: '/icons/typescript.svg', category: 'Language' },
    { id: '4', name: 'Python', icon: '/icons/python.svg', category: 'Language' },
  ];

  const list = isLoading ? [] : (technologies.length ? technologies : fallback);

  return (
    <section id="technologies" ref={ref} className="py-20 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-black to-slate-900/50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SectionHeading kicker="Toolkit" title="Technologies & Skills" className="mb-6" />
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A selection of technologies and skills I use to build, automate, and launch modern digital products.
          </p>
        </motion.div>

        <div className="flex justify-center w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl mx-auto justify-items-center">
            {isLoading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="w-44 h-44 animate-pulse bg-slate-900 border border-slate-800 rounded-xl p-6" />
                ))
              : list.map((tech, index) => (
                  <motion.div
                    key={tech.id || tech.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                    className="group"
                  >
                    <SurfaceCard className="w-44 h-44 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                      {tech.icon ? (
                        <img src={typeof tech.icon === 'string' ? tech.icon : (tech.icon as any).url} alt={tech.name} className="w-12 h-12 mx-auto mb-3 object-contain" />
                      ) : (
                        <IconBadge size="md" className="mx-auto mb-3">
                          <span className="font-bold text-lg text-white">{tech.name.charAt(0)}</span>
                        </IconBadge>
                      )}
                      <h4 className="font-semibold text-white group-hover:text-brand-lighter transition-colors duration-300">{tech.name}</h4>
                    </SurfaceCard>
                  </motion.div>
                ))}
          </div>
        </div>

        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}