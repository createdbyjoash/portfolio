'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { api } from '@/lib/api';
import { SectionHeading } from '@/components/ui/section-heading';
import { IconBadge } from '@/components/ui/icon-badge';

export default function AboutSection() {
  const [aboutData, setAboutData] = useState({
    title: 'About Me',
    description: '',
    profileImage: '',
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.getAbout();
        const about = data && data.about;
        if (about && typeof about === 'object') {
          setAboutData((prev) => ({
            ...prev,
            description: about.description || '',
            profileImage: about.profileImage || '',
          }));
        }
      } catch (error) {
        // fallback to default
      }
    };
    fetchAbout();
  }, []);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #5d21da 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#5d21da]/30 rounded-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-[#5d21da]/20 to-transparent rounded-2xl"></div>
                
                {aboutData.profileImage ? (
                  <img
                    src={aboutData.profileImage}
                    alt="Profile"
                    className="relative z-10 w-full h-auto rounded-2xl shadow-brand-lg"
                  />
                ) : (
                  <IconBadge size="lg" className="relative z-10 w-full aspect-square !rounded-2xl">
                    <span className="text-6xl font-bold text-white">
                      {aboutData.title ? aboutData.title.charAt(0) : ""}
                    </span>
                  </IconBadge>
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-6"
                >
                  <SectionHeading kicker="About" title={aboutData.title} align="left" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-lg text-slate-300 leading-relaxed"
                >
                  {aboutData.description}
                </motion.p>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                {[
                  { number: '50+', label: 'Projects' },
                  { number: '3+', label: 'Years Experience' },
                  { number: '100%', label: 'Client Satisfaction' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.6 + index * 0.1 }}
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-brand-lighter">
                      {stat.number}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}