'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { api, Social } from '@/lib/api';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';
import { SectionHeading } from '@/components/ui/section-heading';
import { IconBadge } from '@/components/ui/icon-badge';

export default function ContactSection() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    loadSocials();
  }, []);

  const loadSocials = async () => {
    try {
      const data = await api.getSocials();
      setSocials(data);
    } catch (error) {
      console.error('Failed to load social links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={ref} className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SectionHeading kicker="Contact" title="Let's Work Together" className="mb-6" />
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[28px] border border-slate-800 bg-slate-900/50 p-8"
          >
            <div className="max-w-xl space-y-6">
              <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
                Best next step
              </p>
              <h3 className="text-3xl font-semibold leading-tight text-white">
                Need to talk through scope, budget, or timeline?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Start with the scheduling flow if you want a working session around
                an MVP, redesign, automation, or product decision. It is the fastest
                way to move from interest to clarity.
              </p>
              <div className="space-y-3 text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  Discovery calls are ideal for founders, teams, and solo builders with a defined problem.
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  If you only need a quick answer, email works better and I can respond asynchronously.
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-brand px-7 text-white shadow-brand-md hover:bg-brand-dark hover:shadow-brand-glow"
              >
                <a href="#schedule">
                  Go to scheduling
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-brand-lighter">
                Get in Touch
              </h3>
              <p className="text-slate-300 leading-relaxed mb-8">
                Prefer to schedule a call instead? Use the booking widget to find a time that works for you.
                I'm also available via email for any questions or quick discussions.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-brand/30 transition-colors duration-300"
              >
                <IconBadge>
                  <Mail className="w-6 h-6" />
                </IconBadge>
                <div>
                  <h4 className="font-medium text-white">Email</h4>
                  <p className="text-slate-400">{siteConfig.email}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-brand/30 transition-colors duration-300"
              >
                <IconBadge>
                  <Phone className="w-6 h-6" />
                </IconBadge>
                <div>
                  <h4 className="font-medium text-white">Phone</h4>
                  <p className="text-slate-400">{siteConfig.phone}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-brand/30 transition-colors duration-300"
              >
                <IconBadge>
                  <MapPin className="w-6 h-6" />
                </IconBadge>
                <div>
                  <h4 className="font-medium text-white">Location</h4>
                  <p className="text-slate-400">{siteConfig.location}</p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            {!isLoading && socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <h4 className="text-lg font-medium mb-4 text-white">
                  Connect with me
                </h4>
                <div className="flex gap-4">
                  {socials.map((social, index) => (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.06, y: -2 }}
                    >
                      <IconBadge className="hover:border-brand/50 transition-colors duration-300">
                        {social.icon ? (
                          <img src={social.icon} alt={social.platform} className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{social.platform.charAt(0)}</span>
                        )}
                      </IconBadge>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
