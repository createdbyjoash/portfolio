'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { api, Project } from '@/lib/api';
import { auth } from '@/lib/auth';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, X } from 'lucide-react';

// Live/GitHub links are often saved as bare domains (e.g. "mwawazi.com") —
// as a plain href that resolves relative to the current page. Normalize to
// an absolute URL before rendering as a link.
function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      // api.getProjects() may return an array of projects or an object like { projects: [...] }
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && Array.isArray((data as any).projects)) {
        setProjects((data as any).projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
    });
    setEditingProject(null);
    setShowAddForm(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('technologies', formData.technologies);
      formDataToSend.append('liveLink', formData.liveUrl); // Fix field name for backend
      formDataToSend.append('githubLink', formData.githubUrl); // Fix field name for backend
      formDataToSend.append('featured', formData.featured ? 'true' : 'false');
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      if (editingProject) {
        const idToUse = (editingProject._id || editingProject.id);
        if (!idToUse) throw new Error('Project id missing');
        await api.updateProject(
          idToUse,
          {
            title: formData.title,
            description: formData.description,
            technologies: formData.technologies.split(',').map(t => t.trim()),
            liveLink: formData.liveUrl,
            githubLink: formData.githubUrl,
            featured: formData.featured,
          },
          token,
          selectedImage || undefined
        );
        toast.success('Project updated successfully!');
      } else {
        await api.createProject(
          {
            title: formData.title,
            description: formData.description,
            technologies: formData.technologies.split(',').map(t => t.trim()),
            liveLink: formData.liveUrl,
            githubLink: formData.githubUrl,
            featured: formData.featured,
            image: '',
          },
          token,
          selectedImage || undefined
        );
        toast.success('Project created successfully!');
      }

      await loadProjects();
      resetForm();
      setSelectedImage(null);
      setPreviewImage('');
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: typeof project.image === 'string' ? project.image : project.image?.url || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      liveUrl: project.liveUrl || project.liveLink || '',
      githubUrl: project.githubUrl || project.githubLink || '',
      featured: project.featured,
    });
    setSelectedImage(null);
    setPreviewImage(typeof project.image === 'string' ? project.image : project.image?.url || '');
    setEditingProject(project);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirm) return;

    try {
      setDeletingId(id);
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      await api.deleteProject(id, token);
      toast.success('Project deleted successfully!');
      await loadProjects();
    } catch (error: any) {
      // show server-provided errors when possible
      toast.error(error?.message || 'Failed to delete project');
    } finally {
      setDeletingId(null);
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
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-[#5d21da] hover:bg-[#4a1ba8] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Project Image</Label>
                <Input
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
                {(previewImage || formData.image) && (
                  <img
                    src={previewImage || formData.image}
                    alt="Project Preview"
                    className="mt-2 w-16 h-16 object-cover rounded-md border border-slate-700"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Technologies (comma-separated)</Label>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Live URL</Label>
                <Input
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">GitHub URL</Label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured" className="text-white">Featured Project</Label>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-[#5d21da] hover:bg-[#4a1ba8] text-white"
            >
              {isSaving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project._id || project.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                        {project.image && (
                          <img
                            src={typeof project.image === 'string' ? project.image : project.image.url}
                            alt={project.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                    <div>
                      <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                      <p className="text-slate-400 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-[#5d21da] text-white text-xs rounded">
                          Featured
                        </span>
                      )}
                      {/* Show Live Link and GitHub Link */}
                      <div className="flex gap-2 mt-2">
                        {project.liveUrl || project.liveLink ? (
                          <a
                            href={toAbsoluteUrl(project.liveUrl || project.liveLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#5d21da] underline text-xs"
                          >
                            Live Site
                          </a>
                        ) : null}
                        {project.githubUrl || project.githubLink ? (
                          <a
                            href={toAbsoluteUrl(project.githubUrl || project.githubLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 underline text-xs"
                          >
                            GitHub
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(project)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const id = project._id || project.id;
                        if (id) handleDelete(id);
                      }}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                      disabled={deletingId === (project._id || project.id)}
                    >
                      {deletingId === (project._id || project.id) ? 'Deleting...' : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-slate-400">No projects found.</div>
        )}
      </div>
    </motion.div>
  );
}