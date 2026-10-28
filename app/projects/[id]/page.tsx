import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/api';

interface Project {
  id?: number | string;
  _id?: string;
  title: string;
  description: string;
  image?: string | { url?: string } | any;
  technologies: string[];
  liveLink?: string;
  liveUrl?: string;
  githubLink?: string;
  githubUrl?: string;
  featured?: boolean;
}

function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body) ? body : body?.projects ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: String(p.id ?? p._id) }));
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projects = await getAllProjects();
  const project = projects.find((p) => String(p.id ?? p._id) === params.id);

  if (!project) notFound();

  const imageUrl =
    typeof project.image === 'string'
      ? project.image
      : project.image?.url ?? null;

  const liveUrl = toAbsoluteUrl(project.liveLink ?? project.liveUrl);
  const githubUrl = toAbsoluteUrl(project.githubLink ?? project.githubUrl);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Hero image */}
      <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-[#1c1530] to-[#120d20] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-7xl font-bold text-white/20">{project.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {project.title}
        </h1>

        {/* Featured badge */}
        {project.featured && (
          <span className="inline-block mb-6 px-3 py-1 bg-[#5d21da] text-white text-xs rounded-full font-medium">
            Featured Project
          </span>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="bg-slate-700 text-slate-200 text-sm px-3 py-1">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line mb-10">
          {project.description}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4">
          {liveUrl && (
            <Button
              asChild
              size="lg"
              className="bg-[#5d21da] hover:bg-[#4a1ba8] text-white rounded-full px-8"
            >
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Demo
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 rounded-full px-8"
            >
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
