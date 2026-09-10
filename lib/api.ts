export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://joash-backend.onrender.com/api';

export interface Booking {
  id: number;
  invitee_name: string | null;
  invitee_email: string | null;
  event_type: string | null;
  scheduled_at: string | null;
  status: string | null;
  created_at: string;
}

// Types for API responses
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export interface AboutData {
  title?: string;
  description?: string;
  profileImage?: string;
  skills?: string[];
}

export interface Technology {
  id?: string;
  _id?: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface Project {
  // Backend may return either `id` or `_id` depending on source (DB vs API)
  id?: string;
  _id?: string;
  title: string;
  description: string;
  // image can be a string URL or an object with a `url` field (depending on upload provider)
  image?: string | { url?: string } | any;
  technologies: string[];
  // API may use either liveUrl/liveLink and githubUrl/githubLink
  liveUrl?: string;
  liveLink?: string;
  githubUrl?: string;
  githubLink?: string;
  featured: boolean;
}

export interface Social {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// API functions
export const api = {
  // Hero section
  // getHero may return either the raw hero object or a wrapper like { hero: {...} }
  getHero: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/hero`);
    if (!response.ok) throw new Error('Failed to fetch hero data');
    return response.json();
  },

  updateHero: async (data: HeroData, token: string): Promise<HeroData> => {
    const response = await fetch(`${API_BASE_URL}/hero`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update hero data');
    return response.json();
  },

  // About section - may return { about: {...} } or the raw about object
  getAbout: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/about`);
    if (!response.ok) throw new Error('Failed to fetch about data');
    return response.json();
  },

  updateAbout: async (data: AboutData, token: string): Promise<AboutData> => {
    const response = await fetch(`${API_BASE_URL}/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update about data');
    return response.json();
  },

  // Technologies
  getTechnologies: async (): Promise<Technology[]> => {
    const response = await fetch(`${API_BASE_URL}/technologies`);
    if (!response.ok) throw new Error('Failed to fetch technologies');
    const body = await response.json();
    // Backend may return either an array or { success: true, technologies: [...] }
    if (Array.isArray(body)) return body as Technology[];
    if (body && Array.isArray((body as any).technologies)) return (body as any).technologies as Technology[];
    return [];
  },

  updateTechnologies: async (data: Technology[], token: string): Promise<Technology[]> => {
    // Backend exposes per-technology update (PUT /technologies/:id).
    // If clients call this with an array, update each technology individually.
    const results: Technology[] = [];
    for (const tech of data) {
      if (!tech.id && !tech._id) continue;
      const id = (tech as any).id || (tech as any)._id;
      const response = await fetch(`${API_BASE_URL}/technologies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: tech.name, description: (tech as any).description, icon: tech.icon }),
      });
      if (!response.ok) {
        // swallow individual failures but log them
        try {
          const err = await response.text();
          console.error('Failed to update technology', id, err);
        } catch (_) {
          console.error('Failed to update technology', id);
        }
        continue;
      }
      const body = await response.json();
      if (body && body.technology) results.push(body.technology as Technology);
    }
    return results;
  },

  createTechnology: async (data: { name: string; icon?: string }, token: string, iconFile?: File): Promise<any> => {
    const form = new FormData();
    form.append('name', data.name);
    if (data.icon) form.append('icon', data.icon);
    if (iconFile) form.append('icon', iconFile);
    const response = await fetch(`${API_BASE_URL}/technologies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: form,
    });
    if (!response.ok) throw new Error('Failed to create technology');
    return response.json();
  },

  deleteTechnology: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/technologies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete technology');
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  createProject: async (data: Omit<Project, 'id'>, token: string, imageFile?: File): Promise<Project> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'technologies' && Array.isArray(value)) {
        formData.append(key, value.join(','));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  updateProject: async (id: string, data: Partial<Project>, token: string, imageFile?: File): Promise<Project> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'technologies' && Array.isArray(value)) {
        formData.append(key, value.join(','));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  deleteProject: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      // Try to surface server-provided error messages when available
      let message = 'Failed to delete project';
      try {
        const body = await response.json();
        if (body && (body.message || body.error)) {
          message = body.message || body.error;
        }
      } catch (e) {
        try {
          const text = await response.text();
          if (text) message = text;
        } catch (_) {
          /* ignore */
        }
      }
      throw new Error(message);
    }
  },

  // Social links
  getSocials: async (): Promise<Social[]> => {
    const response = await fetch(`${API_BASE_URL}/socials`);
    if (!response.ok) throw new Error('Failed to fetch social links');
    const body = await response.json();
    return body?.socials ?? [];
  },

  // NOTE: there is no bulk PUT /socials route on the backend (each social is
  // updated individually via PUT /socials/:id). This function is unused by
  // any component — SocialsEditor is currently read-only. Left as a stub in
  // case bulk editing is wired up later.
  updateSocials: async (data: Social[], token: string): Promise<Social[]> => {
    const response = await fetch(`${API_BASE_URL}/socials`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update social links');
    return response.json();
  },

  // Contact
  submitContact: async (data: ContactMessage, timeout = 15000): Promise<void> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      if (!response.ok) {
        let errMsg = 'Failed to submit contact message';
        try {
          const body = await response.json();
          if (body && (body.message || body.error)) errMsg = body.message || body.error;
        } catch (_) {
          try {
            const text = await response.text();
            if (text) errMsg = text;
          } catch (_) {}
        }
        throw new Error(errMsg);
      }
    } catch (err: any) {
      if (err && err.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  },

  // Authentication
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  },

  // Auth is a stateless JWT — logging out is purely a client-side token removal
  // (see lib/auth.ts clearToken()). No backend call needed.
  logout: async (): Promise<void> => {
    return Promise.resolve();
  },

  // Bookings (Calendly webhook events)
  getBookings: async (token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const body = await response.json();
    return body.bookings ?? [];
  },
};