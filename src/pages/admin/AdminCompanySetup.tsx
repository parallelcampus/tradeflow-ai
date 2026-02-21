import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Briefcase, Search, MoreHorizontal, Edit, Trash2, Eye,
  CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

type SetupRequest = {
  id: string;
  company_name: string;
  country_code: string;
  business_type: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string | null;
  progress_percentage: number | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string | null;
  user_id: string;
};

const statusOptions = ['submitted', 'under_review', 'in_progress', 'documents_pending', 'completed', 'rejected'];

export default function AdminCompanySetup() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<SetupRequest | null>(null);
  const [editForm, setEditForm] = useState({ status: '', progress_percentage: '', admin_notes: '' });
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin-company-setup'],
    queryFn: async () => {
      const { data, error } = await supabase.from('company_setup_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as SetupRequest[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await supabase.from('company_setup_requests').update({
        status: editForm.status,
        progress_percentage: editForm.progress_percentage ? Number(editForm.progress_percentage) : 0,
        admin_notes: editForm.admin_notes || null,
      }).eq('id', selected.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Request updated');
      queryClient.invalidateQueries({ queryKey: ['admin-company-setup'] });
      setDialogOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('company_setup_requests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Request deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-company-setup'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (r: SetupRequest) => {
    setSelected(r);
    setEditForm({
      status: r.status || 'submitted',
      progress_percentage: r.progress_percentage?.toString() || '0',
      admin_notes: r.admin_notes || '',
    });
    setDialogOpen(true);
  };

  const filtered = requests?.filter(r =>
    r.company_name.toLowerCase().includes(search.toLowerCase()) ||
    r.contact_name.toLowerCase().includes(search.toLowerCase()) ||
    r.country_code.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string | null) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-600">Completed</Badge>;
      case 'in_progress': return <Badge>In Progress</Badge>;
      case 'under_review': return <Badge variant="outline">Under Review</Badge>;
      case 'documents_pending': return <Badge variant="secondary">Docs Pending</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Submitted</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Setup Requests</h1>
        <p className="text-muted-foreground">Manage international company incorporation requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Requests', val: requests?.length || 0, icon: Briefcase, color: 'text-primary' },
          { label: 'In Progress', val: requests?.filter(r => r.status === 'in_progress').length || 0, icon: Clock, color: 'text-amber-600' },
          { label: 'Completed', val: requests?.filter(r => r.status === 'completed').length || 0, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Pending Review', val: requests?.filter(r => r.status === 'submitted' || r.status === 'under_review').length || 0, icon: AlertCircle, color: 'text-blue-600' },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold">{s.val}</p><p className="text-sm text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4"><CardTitle className="text-lg">All Company Setup Requests</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !filtered?.length ? (
            <p className="text-center py-8 text-muted-foreground">No requests found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.company_name}</TableCell>
                    <TableCell>
                      <div><p className="text-sm">{r.contact_name}</p><p className="text-xs text-muted-foreground">{r.contact_email}</p></div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{r.country_code}</Badge></TableCell>
                    <TableCell>{r.business_type || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={r.progress_percentage || 0} className="h-2" />
                        <span className="text-xs text-muted-foreground">{r.progress_percentage || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(r)}><Edit className="h-4 w-4 mr-2" />Edit Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(r.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Request: {selected?.company_name}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Status</Label>
              <Select value={editForm.status} onValueChange={v => setEditForm(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Progress (%)</Label>
              <Input type="number" min="0" max="100" value={editForm.progress_percentage} onChange={e => setEditForm(p => ({ ...p, progress_percentage: e.target.value }))} />
            </div>
            <div className="grid gap-2"><Label>Admin Notes</Label>
              <Textarea value={editForm.admin_notes} onChange={e => setEditForm(p => ({ ...p, admin_notes: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
