import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  TrendingUp, Plus, Search, Eye, Edit, Trash2, MoreHorizontal,
  DollarSign, Globe, Briefcase, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

type InvestmentProject = {
  id: string;
  title: string;
  sector: string;
  country: string | null;
  investment_type: string | null;
  investment_required: number | null;
  currency: string | null;
  expected_roi: string | null;
  project_stage: string | null;
  timeline: string | null;
  description: string | null;
  contact_email: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  is_public: boolean | null;
  admin_notes: string | null;
  created_at: string | null;
};

const emptyForm = {
  title: '', sector: '', country: '', investment_type: '', investment_required: '',
  currency: 'USD', expected_roi: '', project_stage: 'concept', timeline: '',
  description: '', contact_email: '', is_active: true, is_featured: false,
  is_public: true, admin_notes: '',
};

export default function AdminInvestment() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-investment-projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('investment_projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as InvestmentProject[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: typeof form) => {
      const payload = {
        title: values.title,
        sector: values.sector,
        country: values.country || null,
        investment_type: values.investment_type || null,
        investment_required: values.investment_required ? Number(values.investment_required) : null,
        currency: values.currency || 'USD',
        expected_roi: values.expected_roi || null,
        project_stage: values.project_stage || null,
        timeline: values.timeline || null,
        description: values.description || null,
        contact_email: values.contact_email || null,
        is_active: values.is_active,
        is_featured: values.is_featured,
        is_public: values.is_public,
        admin_notes: values.admin_notes || null,
      };
      if (editId) {
        const { error } = await supabase.from('investment_projects').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('investment_projects').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? 'Project updated' : 'Project created');
      queryClient.invalidateQueries({ queryKey: ['admin-investment-projects'] });
      closeDialog();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('investment_projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-investment-projects'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openCreate = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: InvestmentProject) => {
    setEditId(p.id);
    setForm({
      title: p.title, sector: p.sector, country: p.country || '',
      investment_type: p.investment_type || '', investment_required: p.investment_required?.toString() || '',
      currency: p.currency || 'USD', expected_roi: p.expected_roi || '',
      project_stage: p.project_stage || 'concept', timeline: p.timeline || '',
      description: p.description || '', contact_email: p.contact_email || '',
      is_active: p.is_active ?? true, is_featured: p.is_featured ?? false,
      is_public: p.is_public ?? true, admin_notes: p.admin_notes || '',
    });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditId(null); setForm(emptyForm); };

  const filtered = projects?.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.sector.toLowerCase().includes(search.toLowerCase()) ||
    (p.country || '').toLowerCase().includes(search.toLowerCase())
  );

  const stageBadge = (stage: string | null) => {
    switch (stage) {
      case 'concept': return <Badge variant="secondary">Concept</Badge>;
      case 'feasibility': return <Badge variant="outline">Feasibility</Badge>;
      case 'implementation': return <Badge>Implementation</Badge>;
      case 'operational': return <Badge className="bg-emerald-600">Operational</Badge>;
      default: return <Badge variant="secondary">{stage || '-'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Investment Cases</h1>
          <p className="text-muted-foreground">Manage investment projects and opportunities</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" />Add Project</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Projects', val: projects?.length || 0, icon: TrendingUp, color: 'text-primary' },
          { label: 'Active', val: projects?.filter(p => p.is_active).length || 0, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Featured', val: projects?.filter(p => p.is_featured).length || 0, icon: DollarSign, color: 'text-amber-600' },
          { label: 'Countries', val: new Set(projects?.map(p => p.country).filter(Boolean)).size, icon: Globe, color: 'text-blue-600' },
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
        <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Investment Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !filtered?.length ? (
            <p className="text-center py-8 text-muted-foreground">No projects found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                    <TableCell><Badge variant="outline">{p.sector}</Badge></TableCell>
                    <TableCell>{p.country || '-'}</TableCell>
                    <TableCell>{p.investment_required ? `${p.currency || '$'} ${p.investment_required.toLocaleString()}` : '-'}</TableCell>
                    <TableCell>{stageBadge(p.project_stage)}</TableCell>
                    <TableCell>
                      {p.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(p)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Investment Project</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Sector *</Label><Input value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Country</Label><Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2"><Label>Investment Required</Label><Input type="number" value={form.investment_required} onChange={e => setForm(p => ({ ...p, investment_required: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Currency</Label>
                <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="INR">INR</SelectItem><SelectItem value="GBP">GBP</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Expected ROI</Label><Input value={form.expected_roi} onChange={e => setForm(p => ({ ...p, expected_roi: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Project Stage</Label>
                <Select value={form.project_stage} onValueChange={v => setForm(p => ({ ...p, project_stage: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="concept">Concept</SelectItem><SelectItem value="feasibility">Feasibility</SelectItem><SelectItem value="implementation">Implementation</SelectItem><SelectItem value="operational">Operational</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Timeline</Label><Input value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))} /></div>
            </div>
            <div className="grid gap-2"><Label>Investment Type</Label><Input value={form.investment_type} onChange={e => setForm(p => ({ ...p, investment_type: e.target.value }))} placeholder="e.g., FDI, JV, Greenfield" /></div>
            <div className="grid gap-2"><Label>Contact Email</Label><Input value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} /></div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
            <div className="grid gap-2"><Label>Admin Notes</Label><Textarea value={form.admin_notes} onChange={e => setForm(p => ({ ...p, admin_notes: e.target.value }))} rows={2} /></div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))} /><Label>Featured</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_public} onCheckedChange={v => setForm(p => ({ ...p, is_public: v }))} /><Label>Public</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => upsert.mutate(form)} disabled={!form.title || !form.sector || upsert.isPending}>
              {editId ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
