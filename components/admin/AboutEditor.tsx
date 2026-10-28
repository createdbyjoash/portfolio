'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, AboutData, API_BASE_URL } from '@/lib/api';
import { auth } from '@/lib/auth';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

export default function AboutEditor() {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: '',
    description: '',
    profileImage: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await api.getAbout();
      const about = data && data.about;
      if (
        about &&
        typeof about === "object" &&
        typeof about.description === "string"
      ) {
        setAboutData({
          description: about.description,
          profileImage: about.profileImage || '',
        });
        setPreviewImage(about.profileImage || '');
      }
    } catch (error) {
      toast.error('Failed to load about data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      let profileImageUrl = aboutData.profileImage;
      if (selectedImage) {
        // Upload image to backend (which uploads to Cloudinary)
        const formData = new FormData();
        formData.append('image', selectedImage);
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!res.ok) throw new Error('Image upload failed');
        const result = await res.json();
        profileImageUrl = result.url;
      }

      await api.updateAbout({
        description: aboutData.description,
        profileImage: profileImageUrl,
      }, token);
      toast.success('About section updated successfully!');
      setSelectedImage(null);
  setPreviewImage(profileImageUrl || '');
  setAboutData((prev) => ({ ...prev, profileImage: profileImageUrl || '' }));
    } catch (error) {
      toast.error('Failed to update about section');
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setAboutData({
        ...aboutData,
        skills: [...(aboutData.skills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setAboutData({
      ...aboutData,
      skills: (aboutData.skills || []).filter((_, i) => i !== index),
    });
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
          <CardTitle className="text-white">Edit About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Body</Label>
            <Textarea
              id="description"
              value={aboutData.description}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage" className="text-white">Profile Image</Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedImage(e.target.files[0]);
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="bg-slate-800 border-slate-700 text-white"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="mt-2 w-16 h-16 object-cover rounded-full border border-slate-700"
              />
            )}
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