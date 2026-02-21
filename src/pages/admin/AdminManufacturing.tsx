import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Factory, Search, MoreHorizontal, Edit, Trash2,
  CheckCircle, Clock, AlertCircle, Globe
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
import { Skeleton } from '@/components/ui/skeleton';

type Partnership = {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  country: string | null;
  sector: string | null;
  product_category: string | null;
  request_type: string;
  requirements: string | null;
  annual_volume: string | null;
  budget_range: string | null;
  preferred_countries: string[] | null;
  certifications_required: string[] | null;
  status: string | null;
  admin_notes: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

const statusOptions = ['submitted', 'under_review', 'matched', 'in_discussion', 'completed', 'rejected'];

export default function AdminManufacturing() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Partnership | null>(null);
  const [editForm, setEditForm] = useState({ status: '', admin_notes: '' });
  const queryClient = useQueryClient();

  const { data: partnerships, isLoading } = useQuery({
    queryKey: ['admin-manufacturing'],
    queryFn: async () => {
      const { data, error } = await supabase.from('manufacturing_partnerships').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Partnership[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await supabase.from('manufacturing_partnerships').update({
        status: editForm.status,
        admin_notes: editForm.admin_notes || null,
      }).eq('id', selected.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Partnership updated');
      queryClient.invalidateQueries({ queryKey: ['admin-manufacturing'] });
      setDialogOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('manufacturing_partnerships').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Partnership deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-manufacturing'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (p: Partnership) => {
    setSelected(p);
    setEditForm({ status: p.status || 'submitted', admin_notes: p.admin_notes || '' });
    setDialogOpen(true);
  };

  const filtered = partnerships?.filter(p =>
    p.company_name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact_name.toLowerCase().includes(search.toLowerCase()) ||
    p.request_type.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string | null) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-600">Completed</Badge>;
      case 'matched': return <Badge>Matched</Badge>;
      case 'in_discussion': return <Badge variant="outline">In Discussion</Badge>;
      case 'under_review': return <Badge variant="secondary">Under Review</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Submitted</Badge>;
    }
  };

  const typeBadge = (type: string) => {
    switch (type) {
      case 'find_manufacturer': return <Badge variant="outline">Find Manufacturer</Badge>;
      case 'offer_manufacturing': return <Badge variant="outline">Offer Manufacturing</Badge>;
      case 'joint_venture': return <Badge>Joint Venture</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manufacturing Partnerships</h1>
        <p className="text-muted-foreground">Manage factory matchmaking and vendor sourcing requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Requests', val: partnerships?.length || 0, icon: Factory, color: 'text-primary' },
          { label: 'Under Review', val: partnerships?.filter(p => p.status === 'under_review' || p.status === 'submitted').length || 0, icon: Clock, color: 'text-amber-600' },
          { label: 'Matched', val: partnerships?.filter(p => p.status === 'matched' || p.status === 'completed').length || 0, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Countries', val: new Set(partnerships?.map(p => p.country).filter(Boolean)).size, icon: Globe, color: 'text-blue-600' },
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
        <Input placeholder="Search partnerships..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4"><CardTitle className="text-lg">All Partnership Requests</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !filtered?.length ? (
            <p className="text-center py-8 text-muted-foreground">No partnerships found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.company_name}</TableCell>
                    <TableCell>
                      <div><p className="text-sm">{p.contact_name}</p><p className="text-xs text-muted-foreground">{p.contact_email}</p></div>
                    </TableCell>
                    <TableCell>{typeBadge(p.request_type)}</TableCell>
                    <TableCell>{p.sector || '-'}</TableCell>
                    <TableCell>{p.country || '-'}</TableCell>
                    <TableCell className="text-sm">{p.annual_volume || '-'}</TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(p)}><Edit className="h-4 w-4 mr-2" />Update Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
          <DialogHeader><DialogTitle>Update: {selected?.company_name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Sector</p><p className="font-medium">{selected.sector || '-'}</p></div>
                <div><p className="text-muted-foreground">Product Category</p><p className="font-medium">{selected.product_category || '-'}</p></div>
                <div><p className="text-muted-foreground">Budget Range</p><p className="font-medium">{selected.budget_range || '-'}</p></div>
                <div><p className="text-muted-foreground">Preferred Countries</p><p className="font-medium">{selected.preferred_countries?.join(', ') || '-'}</p></div>
              </div>
              {selected.requirements && (
                <div><p className="text-sm text-muted-foreground">Requirements</p><p className="text-sm">{selected.requirements}</p></div>
              )}
              <div className="grid gap-2"><Label>Status</Label>
                <Select value={editForm.status} onValueChange={v => setEditForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Admin Notes</Label>
                <Textarea value={editForm.admin_notes} onChange={e => setEditForm(p => ({ ...p, admin_notes: e.target.value }))} rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
