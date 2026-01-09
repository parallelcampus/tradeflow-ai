import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
  Building2,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  MessageSquare,
  FileText,
  AlertCircle,
  CalendarDays,
  Users
} from 'lucide-react';

type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Meeting {
  id: string;
  consultant_id: string;
  client_id: string | null;
  client_name: string;
  client_email: string;
  client_company: string | null;
  meeting_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  meeting_type: string;
  meeting_link: string | null;
  notes: string | null;
  status: MeetingStatus;
  total_cost: number | null;
  created_at: string;
  consultant?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
    hourly_rate: number | null;
  };
}

const statusConfig: Record<MeetingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3.5 w-3.5" /> },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-3.5 w-3.5" /> }
};

const meetingTypeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  in_person: <MapPin className="h-4 w-4" />
};

export default function MyMeetings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Fetch user's meetings
  const { data: meetings, isLoading } = useQuery({
    queryKey: ['my-meetings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get meetings as client
      const { data: clientMeetings, error: clientError } = await supabase
        .from('consultant_meetings')
        .select(`
          *,
          consultant:consultants(id, full_name, avatar_url, headline, hourly_rate)
        `)
        .eq('client_id', user.id)
        .order('meeting_date', { ascending: true });

      if (clientError) throw clientError;

      // Get meetings as consultant
      const { data: consultantData } = await supabase
        .from('consultants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let consultantMeetings: any[] = [];
      if (consultantData) {
        const { data: meetings, error: consultantError } = await supabase
          .from('consultant_meetings')
          .select('*')
          .eq('consultant_id', consultantData.id)
          .order('meeting_date', { ascending: true });

        if (!consultantError) {
          consultantMeetings = meetings || [];
        }
      }

      // Combine and dedupe
      const allMeetings = [...(clientMeetings || []), ...consultantMeetings];
      const uniqueMeetings = allMeetings.filter((meeting, index, self) =>
        index === self.findIndex(m => m.id === meeting.id)
      );

      return uniqueMeetings;
    },
    enabled: !!user?.id
  });

  // Update meeting status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('consultant_meetings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-meetings'] });
      toast.success('Meeting status updated');
      setSelectedMeeting(null);
      setShowCancelDialog(false);
    },
    onError: () => {
      toast.error('Failed to update meeting');
    }
  });

  const now = new Date();
  const upcomingMeetings = meetings?.filter(m => 
    isAfter(parseISO(m.meeting_date), now) || isToday(parseISO(m.meeting_date))
  ).filter(m => m.status !== 'cancelled' && m.status !== 'completed') || [];

  const pastMeetings = meetings?.filter(m => 
    isBefore(parseISO(m.meeting_date), now) && !isToday(parseISO(m.meeting_date))
  ) || [];

  const cancelledMeetings = meetings?.filter(m => m.status === 'cancelled') || [];

  const renderMeetingCard = (meeting: Meeting) => {
    const config = statusConfig[meeting.status as MeetingStatus] || statusConfig.pending;
    const isConsultant = meeting.consultant?.id !== meeting.consultant_id;

    return (
      <Card 
        key={meeting.id} 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedMeeting(meeting)}
      >
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Date & Time */}
            <div className="flex-shrink-0 text-center md:text-left p-3 bg-primary/5 rounded-lg min-w-[100px]">
              <div className="text-sm font-medium text-primary">
                {format(parseISO(meeting.meeting_date), 'MMM d')}
              </div>
              <div className="text-lg font-bold">
                {meeting.start_time}
              </div>
              <div className="text-xs text-muted-foreground">
                {meeting.duration_minutes} min
              </div>
            </div>

            {/* Meeting Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {meeting.consultant ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={meeting.consultant.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {meeting.consultant.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{meeting.consultant.full_name}</h4>
                          <p className="text-xs text-muted-foreground">{meeting.consultant.headline}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{meeting.client_name}</h4>
                          <p className="text-xs text-muted-foreground">{meeting.client_company}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {meetingTypeIcons[meeting.meeting_type] || <Video className="h-4 w-4" />}
                      <span className="capitalize">{meeting.meeting_type?.replace('_', ' ')}</span>
                    </span>
                    {meeting.total_cost && (
                      <span className="font-medium text-foreground">${meeting.total_cost}</span>
                    )}
                  </div>
                </div>

                <Badge className={`${config.color} flex items-center gap-1`}>
                  {config.icon}
                  {config.label}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {meeting.status === 'confirmed' && meeting.meeting_link && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(meeting.meeting_link!, '_blank');
                  }}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Join
                </Button>
              )}
              {meeting.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatusMutation.mutate({ id: meeting.id, status: 'confirmed' });
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMeeting(meeting);
                      setShowCancelDialog(true);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            My Appointments
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled consultations and meetings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{upcomingMeetings.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {meetings?.filter(m => m.status === 'confirmed').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pastMeetings.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {meetings?.filter(m => m.status === 'pending').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Clock className="h-4 w-4" />
            Past ({pastMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <XCircle className="h-4 w-4" />
            Cancelled ({cancelledMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">No upcoming meetings</h3>
                <p className="text-muted-foreground text-sm">
                  Book a consultation with an expert to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingMeetings.map(renderMeetingCard)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">No past meetings</h3>
                <p className="text-muted-foreground text-sm">
                  Your completed consultations will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pastMeetings.map(renderMeetingCard)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">No cancelled meetings</h3>
                <p className="text-muted-foreground text-sm">
                  Cancelled appointments will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            cancelledMeetings.map(renderMeetingCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Meeting Detail Dialog */}
      <Dialog open={!!selectedMeeting && !showCancelDialog} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
          </DialogHeader>

          {selectedMeeting && (
            <div className="space-y-4">
              {/* Status */}
              <Badge className={statusConfig[selectedMeeting.status as MeetingStatus]?.color + ' w-fit'}>
                {statusConfig[selectedMeeting.status as MeetingStatus]?.icon}
                {statusConfig[selectedMeeting.status as MeetingStatus]?.label}
              </Badge>

              {/* Date & Time */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">
                    {format(parseISO(selectedMeeting.meeting_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMeeting.start_time} - {selectedMeeting.end_time} ({selectedMeeting.duration_minutes} min)
                  </div>
                </div>
              </div>

              {/* Meeting Type */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {meetingTypeIcons[selectedMeeting.meeting_type] || <Video className="h-5 w-5 text-primary" />}
                <div>
                  <div className="font-medium capitalize">
                    {selectedMeeting.meeting_type?.replace('_', ' ')} Meeting
                  </div>
                  {selectedMeeting.meeting_link && (
                    <a 
                      href={selectedMeeting.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Join meeting <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Participant */}
              {selectedMeeting.consultant && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedMeeting.consultant.avatar_url || undefined} />
                    <AvatarFallback>
                      {selectedMeeting.consultant.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedMeeting.consultant.full_name}</div>
                    <div className="text-sm text-muted-foreground">{selectedMeeting.consultant.headline}</div>
                  </div>
                </div>
              )}

              {/* Cost */}
              {selectedMeeting.total_cost && (
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="text-lg font-semibold">${selectedMeeting.total_cost}</span>
                </div>
              )}

              {/* Notes */}
              {selectedMeeting.notes && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Notes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedMeeting.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedMeeting.status === 'confirmed' && selectedMeeting.meeting_link && (
                  <Button 
                    className="flex-1"
                    onClick={() => window.open(selectedMeeting.meeting_link!, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
                {selectedMeeting.status === 'pending' && (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => updateStatusMutation.mutate({ id: selectedMeeting.id, status: 'confirmed' })}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Meeting</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this meeting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason (optional)</label>
              <Textarea
                placeholder="Why are you cancelling?"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Meeting
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedMeeting) {
                    updateStatusMutation.mutate({ id: selectedMeeting.id, status: 'cancelled' });
                  }
                }}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Cancel Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
