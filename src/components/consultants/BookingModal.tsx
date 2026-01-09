import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, Clock, Video, Phone, MapPin, 
  DollarSign, CheckCircle2, Loader2, ArrowRight, ArrowLeft
} from 'lucide-react';

interface BookingModalProps {
  consultant: {
    id: string;
    full_name: string;
    hourly_rate: number | null;
    currency: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function BookingModal({ consultant, open, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingType, setMeetingType] = useState<'video' | 'phone' | 'in_person'>('video');
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  // Fetch user profile for pre-fill
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Pre-fill client info from profile
  useState(() => {
    if (profile) {
      setClientName(profile.full_name || '');
      setClientEmail(profile.email || '');
      setClientCompany(profile.company_name || '');
    }
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['consultant-services', consultant?.id],
    queryFn: async () => {
      if (!consultant?.id) return [];
      const { data, error } = await supabase
        .from('consultant_services')
        .select('*')
        .eq('consultant_id', consultant.id);
      if (error) throw error;
      return data;
    },
    enabled: !!consultant?.id
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!consultant || !selectedDate || !selectedTime) {
        throw new Error('Please complete all required fields');
      }

      const endTime = format(
        new Date(`2000-01-01T${selectedTime}:00`).getTime() + duration * 60 * 1000,
        'HH:mm'
      );

      const { data, error } = await supabase
        .from('consultant_meetings')
        .insert({
          consultant_id: consultant.id,
          client_id: user?.id || null,
          client_name: clientName,
          client_email: clientEmail,
          client_company: clientCompany,
          meeting_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          end_time: endTime,
          duration_minutes: duration,
          meeting_type: meetingType,
          notes: notes,
          total_cost: consultant.hourly_rate ? (consultant.hourly_rate * duration / 60) : null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Meeting request sent!', {
        description: `Your meeting with ${consultant?.full_name} has been requested.`
      });
      queryClient.invalidateQueries({ queryKey: ['my-meetings'] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error('Failed to book meeting', {
        description: error.message
      });
    }
  });

  const handleClose = () => {
    setStep(1);
    setSelectedDate(addDays(new Date(), 1));
    setSelectedTime('');
    setMeetingType('video');
    setDuration(60);
    setNotes('');
    onClose();
  };

  const totalCost = consultant?.hourly_rate 
    ? (consultant.hourly_rate * duration / 60).toFixed(2) 
    : null;

  if (!consultant) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Meeting</DialogTitle>
          <DialogDescription>
            Schedule a consultation with {consultant.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : step > s
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
            ))}
          </div>

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border mx-auto"
                />
              </div>

              <div>
                <Label className="mb-2 block">Select Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedDate || !selectedTime}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Meeting Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Meeting Type</Label>
                <RadioGroup
                  value={meetingType}
                  onValueChange={(v) => setMeetingType(v as any)}
                  className="grid grid-cols-3 gap-4"
                >
                  <Label
                    htmlFor="video"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                      meetingType === 'video' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="video" id="video" className="sr-only" />
                    <Video className="h-6 w-6" />
                    <span className="text-sm font-medium">Video Call</span>
                  </Label>
                  <Label
                    htmlFor="phone"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                      meetingType === 'phone' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="phone" id="phone" className="sr-only" />
                    <Phone className="h-6 w-6" />
                    <span className="text-sm font-medium">Phone</span>
                  </Label>
                  <Label
                    htmlFor="in_person"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                      meetingType === 'in_person' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="in_person" id="in_person" className="sr-only" />
                    <MapPin className="h-6 w-6" />
                    <span className="text-sm font-medium">In Person</span>
                  </Label>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-2 block">Duration</Label>
                <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Notes (Optional)</Label>
                <Textarea
                  placeholder="What would you like to discuss?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="Acme Inc"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{selectedDate && format(selectedDate, 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{meetingType.replace('_', ' ')}</span>
                  </div>
                  {totalCost && (
                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Estimated Cost</span>
                      <span>${totalCost}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => bookingMutation.mutate()}
                  disabled={!clientName || !clientEmail || bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
