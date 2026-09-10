'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api, Booking } from '@/lib/api';
import { auth } from '@/lib/auth';
import { toast } from 'sonner';

export default function BookingsViewer() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');
      const data = await api.getBookings(token);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-slate-400">Loading bookings…</p>;
  }

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardHeader>
        <CardTitle className="text-white">
          Calendly Bookings
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({bookings.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length === 0 && (
          <p className="text-slate-400 text-sm">
            No bookings yet. Once the Calendly webhook is registered (see
            backend/scripts/registerCalendlyWebhook.js), confirmed calls will appear here.
          </p>
        )}
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3"
          >
            <div>
              <p className="text-white font-medium">{b.invitee_name || 'Unknown'}</p>
              <p className="text-sm text-slate-400">{b.invitee_email}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : '—'}</span>
              <Badge
                variant={b.status === 'canceled' ? 'destructive' : 'secondary'}
              >
                {b.status || 'scheduled'}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
