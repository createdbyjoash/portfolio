'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, HeroData } from '@/lib/api';
import { auth } from '@/lib/auth';
import { toast } from 'sonner';

export default function HeroEditor() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const data = await api.getHero();
      const hero = data && data.hero;
      if (hero && typeof hero === "object") {
        setHeroData((prev) => ({
          ...prev,
          ...(hero.title !== undefined ? { title: hero.title } : {}),
          ...(hero.subtitle !== undefined ? { subtitle: hero.subtitle } : {}),
          ...(hero.description !== undefined ? { description: hero.description } : {}),
        }));
      }
    } catch (error) {
      toast.error('Failed to load hero data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');
      
      await api.updateHero(heroData, token);
      toast.success('Hero section updated successfully!');
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#5d21da] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Edit Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
            <Input
              id="subtitle"
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={heroData.description}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#5d21da] hover:bg-[#4a1ba8] text-white"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}