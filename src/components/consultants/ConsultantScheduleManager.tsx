import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings2,
  Users,
  DollarSign
} from 'lucide-react';

interface Availability {
  id: string;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
}

interface Meeting {
  id: string;
  client_name: string;
  client_email: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_type: string;
  total_cost: number | null;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
];

export default function ConsultantScheduleManager() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlotDay, setNewSlotDay] = useState<string>('1');
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('17:00');

  // Get consultant profile
  const { data: consultant } = useQuery({
    queryKey: ['consultant-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Get availability
  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ['consultant-availability', consultant?.id],
    queryFn: async () => {
      if (!consultant?.id) return [];
      const { data, error } = await supabase
        .from('consultant_availability')
        .select('*')
        .eq('consultant_id', consultant.id)
        .order('day_of_week');
      if (error) throw error;
      return data as Availability[];
    },
    enabled: !!consultant?.id
  });

  // Get upcoming meetings
  const { data: meetings, isLoading: loadingMeetings } = useQuery({
    queryKey: ['consultant-meetings', consultant?.id],
    queryFn: async () => {
      if (!consultant?.id) return [];
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('consultant_meetings')
        .select('*')
        .eq('consultant_id', consultant.id)
        .gte('meeting_date', today)
        .order('meeting_date', { ascending: true });
      if (error) throw error;
      return data as Meeting[];
    },
    enabled: !!consultant?.id
  });

  // Add availability slot
  const addSlotMutation = useMutation({
    mutationFn: async () => {
      if (!consultant?.id) throw new Error('No consultant profile');
      
      const { error } = await supabase
        .from('consultant_availability')
        .insert({
          consultant_id: consultant.id,
          day_of_week: parseInt(newSlotDay),
          start_time: newSlotStart,
          end_time: newSlotEnd,
          is_recurring: true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-availability'] });
      toast.success('Availability slot added');
      setShowAddDialog(false);
    },
    onError: () => {
      toast.error('Failed to add slot');
    }
  });

  // Delete availability slot
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const { error } = await supabase
        .from('consultant_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-availability'] });
      toast.success('Slot removed');
    },
    onError: () => {
      toast.error('Failed to remove slot');
    }
  });

  // Update meeting status
  const updateMeetingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('consultant_meetings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultant-meetings'] });
      toast.success('Meeting updated');
    },
    onError: () => {
      toast.error('Failed to update meeting');
    }
  });

  // Group availability by day
  const availabilityByDay: Record<number, Availability[]> = {};
  availability?.forEach(slot => {
    if (slot.day_of_week !== null) {
      if (!availabilityByDay[slot.day_of_week]) {
        availabilityByDay[slot.day_of_week] = [];
      }
      availabilityByDay[slot.day_of_week].push(slot);
    }
  });

  const pendingMeetings = meetings?.filter(m => m.status === 'pending') || [];
  const confirmedMeetings = meetings?.filter(m => m.status === 'confirmed') || [];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  if (!consultant) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="font-semibold mb-2">No consultant profile</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Register as a consultant to manage your schedule
          </p>
          <Button asChild>
            <a href="/dashboard/consultants/register">Register as Consultant</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingMeetings.length}</div>
            <div className="text-sm text-muted-foreground">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{confirmedMeetings.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{consultant.total_consultations}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">${consultant.hourly_rate || 0}/hr</div>
            <div className="text-sm text-muted-foreground">Hourly Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Availability Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Availability
                </CardTitle>
                <CardDescription>Set your recurring available time slots</CardDescription>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Availability Slot</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Day of Week</Label>
                      <Select value={newSlotDay} onValueChange={setNewSlotDay}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day, i) => (
                            <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Time</Label>
                        <Select value={newSlotStart} onValueChange={setNewSlotStart}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Select value={newSlotEnd} onValueChange={setNewSlotEnd}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => addSlotMutation.mutate()}
                      disabled={addSlotMutation.isPending}
                    >
                      {addSlotMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add Slot
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loadingAvailability ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {DAYS.map((day, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-24 font-medium text-sm">{day}</div>
                    <div className="flex-1">
                      {availabilityByDay[i]?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {availabilityByDay[i].map((slot) => (
                            <Badge 
                              key={slot.id} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {slot.start_time} - {slot.end_time}
                              <button
                                onClick={() => deleteSlotMutation.mutate(slot.id)}
                                className="ml-1 hover:text-destructive"
                              >
                                <XCircle className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Meeting Requests
            </CardTitle>
            <CardDescription>Review and manage incoming requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMeetings ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : pendingMeetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMeetings.slice(0, 5).map((meeting) => (
                  <div key={meeting.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{meeting.client_name}</div>
                        <div className="text-sm text-muted-foreground">{meeting.client_email}</div>
                      </div>
                      <Badge className={statusColors[meeting.status]}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(meeting.meeting_date), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {meeting.start_time}
                      </span>
                      {meeting.total_cost && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          ${meeting.total_cost}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateMeetingMutation.mutate({ id: meeting.id, status: 'confirmed' })}
                        disabled={updateMeetingMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMeetingMutation.mutate({ id: meeting.id, status: 'cancelled' })}
                        disabled={updateMeetingMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Confirmed Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Upcoming Confirmed Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {confirmedMeetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No confirmed meetings</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {confirmedMeetings.map((meeting) => (
                <Card key={meeting.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium">{meeting.client_name}</div>
                      <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(meeting.meeting_date), 'EEEE, MMM d')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {meeting.start_time} - {meeting.end_time}
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
