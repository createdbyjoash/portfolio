'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MessageSquareText,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { siteConfig } from '@/lib/site-config';
import { SectionHeading } from '@/components/ui/section-heading';
import { IconBadge } from '@/components/ui/icon-badge';
import { API_BASE_URL } from '@/lib/api';

// Real Calendly webhooks need a paid Standard plan, which isn't in use here —
// so booking capture happens client-side instead: the embed fires this event
// the moment a visitor books, and we record it ourselves (backend/controllers/
// bookingController.js createBooking) rather than relying on a server-side
// Calendly callback.
async function recordBooking(payload?: Record<string, unknown>) {
  try {
    await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inviteeName: (payload?.invitee_full_name as string) ?? 'Unknown',
        inviteeEmail: (payload?.invitee_email as string) ?? '',
        eventType: 'invitee.created',
        scheduledAt: (payload?.event_start_time as string) ?? null,
      }),
    });
  } catch {
    // Fire-and-forget — never block the booking UX on our own logging call
  }
}

export default function BookingIntegration() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [justScheduled, setJustScheduled] = useState(false);

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const payload = e.data?.payload as Record<string, unknown> | undefined;
      recordBooking(payload);
      setJustScheduled(true);
    },
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const callHighlights = [
    '15 minute MVP deep dive',
    'Project scope and goals review',
    'Timeline and budget alignment',
    'Clear next steps after the call',
  ];

  const callSteps = [
    {
      title: 'Choose a slot',
      description: 'Pick a time that matches your timezone and schedule.',
      icon: CalendarDays,
    },
    {
      title: 'Share context',
      description: 'Add your project link, idea, or challenge in the booking form.',
      icon: MessageSquareText,
    },
    {
      title: 'Join prepared',
      description: 'I review your details ahead of time so the call stays focused.',
      icon: Sparkles,
    },
  ];

  return (
    <section
      id="schedule"
      className="py-20 px-4 bg-black text-white relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,33,218,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(93,33,218,0.12),transparent_30%)]"></div>
        <div className="absolute top-12 left-8 h-40 w-40 rounded-full border border-white/10"></div>
        <div className="absolute bottom-12 right-8 h-56 w-56 rounded-full border border-brand/20"></div>
      </div>

      <div className="container mx-auto relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          
          <SectionHeading kicker="Availability" title="Schedule a call" className="mb-6" />
          <p className="mx-auto max-w-3xl text-lg text-slate-300 md:text-xl">
            Use this call to pressure-test your idea, define the right MVP, or
            unblock a product decision before development starts.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Badge className="bg-white text-black hover:bg-white">
                MVP Deep Dive
              </Badge>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock3 className="h-4 w-4 text-brand-lighter" />
                15 mins
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-semibold leading-tight">
                Book a focused conversation, not a vague intro meeting.
              </h3>
              <p className="max-w-2xl text-slate-300">
                This works best if you already have an idea, an existing product
                that needs improvement, or a technical decision you want clarity on.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {callHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/30 px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-light" />
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    onClick={handleOpenDialog}
                    className="h-12 rounded-full bg-brand px-7 text-white shadow-brand-md hover:bg-brand-dark hover:shadow-brand-glow"
                  >
                    Book a call
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl border-slate-800 bg-slate-950 p-0 text-white sm:max-w-5xl">
                  <DialogHeader className="border-b border-white/10 px-6 py-5">
                    <DialogTitle className="text-2xl">
                      Schedule your MVP deep dive
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Choose a slot and add project context so I can prepare before we meet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-[75vh] min-h-[640px] overflow-hidden rounded-b-lg relative">
                    {/* Loading shimmer behind the Calendly widget */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
                      <div className="h-8 w-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
                      <p className="text-sm text-slate-500">Loading scheduler…</p>
                    </div>
                    <InlineWidget
                      url={siteConfig.calendlyUrl}
                      styles={{ height: '100%', width: '100%', position: 'relative', zIndex: 10 }}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/15 bg-transparent px-7 text-white hover:bg-white hover:text-black"
              >
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in new tab
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {justScheduled && (
              <p className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Call booked — a confirmation email is on its way.
              </p>
            )}

            <p className="mt-4 text-sm text-slate-400">
              If the scheduler does not load, email{' '}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-white underline decoration-brand/60 underline-offset-4"
              >
                {siteConfig.email}
              </a>{' '}
              and I will send available times manually.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            {callSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6"
              >
                <div className="mb-4 flex items-center gap-4">
                  <IconBadge size="md">
                    <step.icon className="h-5 w-5" />
                  </IconBadge>
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
                      Step {index + 1}
                    </p>
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="rounded-[28px] border border-brand/20 bg-gradient-to-br from-brand/15 via-slate-950 to-slate-950 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-lightest" />
                <h3 className="text-lg font-semibold">Before you book</h3>
              </div>
              <p className="text-slate-300">
                Bring any relevant links: Figma, website, deck, brief, or a short note
                on the problem you want solved. That makes the call materially more useful.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
