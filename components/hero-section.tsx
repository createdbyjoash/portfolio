'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { api, HeroData } from '@/lib/api';
import { ArrowRight, CalendarDays } from 'lucide-react';

export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'No Code Solution Expert',
    subtitle: 'Hi, I am Joash Adeoye',
    description: 'I help startups and individuals bring their ideas and product to life by building responsive  and sellable MVPs .',
    ctaText: 'View My Work',
    ctaLink: '#projects',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const data = await api.getHero();
      console.log('API getHero response:', data);
      const hero = data && data.hero;
      if (
        hero &&
        typeof hero === "object" &&
        hero.title &&
        hero.subtitle &&
        hero.description
      ) {
        setHeroData((prev) => ({
          ...prev,
          title: hero.title,
          subtitle: hero.subtitle,
          description: hero.description,
          // ctaText and ctaLink always use default
        }));
      }
      // else: keep default
    } catch (error) {
      console.error('Failed to load hero data:', error);
      setIsLoading(false); // Show default if backend is down
      return;
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-[#5d21da] border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5d21da]/20 via-black to-black"></div>

      {/* Ambient shapes + subtle grid, replacing a scattered particle field with a
          deliberate, fewer-and-larger composition */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
          }}
        />
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 right-[8%] h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-6rem] left-[6%] h-80 w-80 rounded-full bg-brand-light/10 blur-3xl"
        />
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full border border-white/5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 mt-12"
          >
            <div className="space-y-1">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-[#5d21da] font-medium mb-1"
              >
                {heroData.subtitle}
              </motion.h2>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mt-0"
              >
                <span className="bg-gradient-to-r from-white via-white to-[#5d21da] bg-clip-text text-transparent">
                  {heroData.title}
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              {heroData.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-brand hover:bg-brand-dark text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-brand-md hover:shadow-brand-glow"
              >
                <a href={heroData.ctaLink} className="flex items-center gap-2">
                  {heroData.ctaText}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <a href="#schedule">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Schedule a Call
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-[#5d21da] rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
