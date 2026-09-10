'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, Social } from '@/lib/api';
import { Heart } from 'lucide-react';
import { IconBadge } from '@/components/ui/icon-badge';

export default function Footer() {
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    loadSocials();
  }, []);

  const loadSocials = async () => {
    try {
      const data = await api.getSocials();
      setSocials(data);
    } catch (error) {
      console.error('Failed to load social links:', error);
    }
  };

  return (
    <footer className="bg-black text-white py-12 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-brand bg-clip-text text-transparent">
                Joash Adeoye
              </span>
            </h3>
            <p className="text-slate-400">
              Building exceptional digital experiences
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            {Array.isArray(socials) &&
              socials.map((social, index) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                >
                  <IconBadge size="sm">
                    {social.icon ? (
                      <img src={social.icon} alt={social.platform} className="w-5 h-5" />
                    ) : (
                      <span className="font-bold text-sm">{social.platform.charAt(0)}</span>
                    )}
                  </IconBadge>
                </motion.a>
              ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center md:text-right"
          >
            <p className="text-slate-400 flex items-center justify-center md:justify-end gap-1">
              Made with <Heart className="w-4 h-4 text-brand" fill="currentColor" />
              © {new Date().getFullYear()}
            </p>
          </motion.div>
        </div>

        {/* Bottom Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 pt-8 border-t border-slate-800"
        >
          <div className="text-center text-slate-500 text-sm">
            <p>All rights reserved. Joash Adeoye</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}