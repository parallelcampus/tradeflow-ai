import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Search, Eye, MoreHorizontal, HeartPulse, Users, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-500/20 text-blue-700 border-blue-500/30' },
  { value: 'in_review', label: 'In Review', color: 'bg-amber-500/20 text-amber-700 border-amber-500/30' },
  { value: 'assigned', label: 'Assigned', color: 'bg-purple-500/20 text-purple-700 border-purple-500/30' },
  { value: 'in_treatment', label: 'In Treatment', color: 'bg-primary/20 text-primary border-primary/30' },
  { value: 'follow_up', label: 'Follow Up', color: 'bg-orange-500/20 text-orange-700 border-orange-500/30' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500/20 text-green-700 border-green-500/30' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-700 border-red-500/30' },
];

export default function AdminMedicalInquiries() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['medical-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('medical_inquiries')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-inquiries'] });
      toast.success('Inquiry updated successfully');
    },
    onError: () => toast.error('Failed to update inquiry'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('medical_inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-inquiries'] });
      toast.success('Inquiry deleted');
    },
    onError: () => toast.error('Failed to delete inquiry'),
  });

  const filtered = inquiries.filter(i => {
    const matchesSearch = i.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.medical_condition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = statusOptions.find(o => o.value === status);
    return <Badge className={s?.color || ''}>{s?.label || status}</Badge>;
  };

  const counts = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    active: inquiries.filter(i => ['in_review', 'assigned', 'in_treatment'].includes(i.status || '')).length,
    completed: inquiries.filter(i => i.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medical Inquiries</h1>
        <p className="text-muted-foreground">Manage patient consultation requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Inquiries', value: counts.total, icon: HeartPulse, iconColor: 'text-primary' },
          { label: 'New Inquiries', value: counts.new, icon: AlertCircle, iconColor: 'text-blue-600' },
          { label: 'Active Cases', value: counts.active, icon: Clock, iconColor: 'text-amber-600' },
          { label: 'Completed', value: counts.completed, icon: CheckCircle2, iconColor: 'text-green-600' },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, condition, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading inquiries...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No inquiries found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inq) => (
                  <TableRow key={inq.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inq.patient_name}</p>
                        <p className="text-xs text-muted-foreground">{inq.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{inq.country || '—'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{inq.medical_condition || '—'}</TableCell>
                    <TableCell>{inq.preferred_location || '—'}</TableCell>
                    <TableCell>{getStatusBadge(inq.status || 'new')}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedInquiry(inq); setIsDetailOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" />View & Manage
                          </DropdownMenuItem>
                          {statusOptions.map(s => (
                            <DropdownMenuItem key={s.value} onClick={() => updateMutation.mutate({ id: inq.id, updates: { status: s.value } })}>
                              Set: {s.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(inq.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Case Details: {selectedInquiry?.patient_name}</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Country</Label><p className="font-medium">{selectedInquiry.country || '—'}</p></div>
                <div><Label className="text-muted-foreground">Contact</Label><p className="font-medium">{selectedInquiry.contact_email}</p><p className="text-sm">{selectedInquiry.contact_phone}</p></div>
              </div>
              <div><Label className="text-muted-foreground">Medical Condition</Label><p className="font-medium">{selectedInquiry.medical_condition || '—'}</p></div>
              <div><Label className="text-muted-foreground">Preferred Location</Label><p className="font-medium">{selectedInquiry.preferred_location || '—'}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedInquiry.status || 'new'}
                    onValueChange={(val) => {
                      updateMutation.mutate({ id: selectedInquiry.id, updates: { status: val } });
                      setSelectedInquiry({ ...selectedInquiry, status: val });
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Treatment Stage</Label>
                  <Input
                    value={selectedInquiry.treatment_stage || ''}
                    onChange={(e) => setSelectedInquiry({ ...selectedInquiry, treatment_stage: e.target.value })}
                    placeholder="e.g., Pre-consultation"
                  />
                </div>
              </div>
              <div>
                <Label>Case Notes</Label>
                <Textarea
                  value={selectedInquiry.case_notes || ''}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, case_notes: e.target.value })}
                  placeholder="Internal notes about this case..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Follow-up Date</Label>
                <Input
                  type="date"
                  value={selectedInquiry.follow_up_date || ''}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, follow_up_date: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
            <Button onClick={() => {
              const { id, created_at, updated_at, ...rest } = selectedInquiry;
              updateMutation.mutate({ id, updates: { case_notes: rest.case_notes, treatment_stage: rest.treatment_stage, follow_up_date: rest.follow_up_date, status: rest.status } });
              setIsDetailOpen(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
