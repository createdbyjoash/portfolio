'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import HeroEditor from '@/components/admin/HeroEditor';
import AboutEditor from '@/components/admin/AboutEditor';
import TechnologiesEditor from '@/components/admin/TechnologiesEditor';
import ProjectsEditor from '@/components/admin/ProjectsEditor';
import BookingsViewer from '@/components/admin/BookingsViewer';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      auth.removeToken();
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      router.replace('/admin');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#5d21da] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-2 py-3"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-medium">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            Logout
          </Button>
        </div>
        <Tabs defaultValue="hero" className="space-y-2">
          <TabsList className="grid w-full grid-cols-5 gap-2 bg-slate-900 rounded-md p-1">
            <TabsTrigger value="hero" className="data-[state=active]:bg-[#5d21da] py-1 text-sm text-center rounded-sm">
              Hero
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-[#5d21da] py-1 text-sm text-center rounded-sm">
              About
            </TabsTrigger>
            <TabsTrigger value="technologies" className="data-[state=active]:bg-[#5d21da] py-1 text-sm text-center rounded-sm">
              Technologies
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-[#5d21da] py-1 text-sm text-center rounded-sm">
              Projects
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-[#5d21da] py-1 text-sm text-center rounded-sm">
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="p-0">
            <HeroEditor />
          </TabsContent>

          <TabsContent value="about" className="p-0">
            <AboutEditor />
          </TabsContent>

          <TabsContent value="technologies" className="p-0">
            <TechnologiesEditor />
          </TabsContent>

          <TabsContent value="projects" className="p-0">
            <ProjectsEditor />
          </TabsContent>

          <TabsContent value="bookings" className="p-0">
            <BookingsViewer />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}