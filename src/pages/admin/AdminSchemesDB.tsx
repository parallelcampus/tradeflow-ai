import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Landmark, Plus, Search, Edit, Trash2, MoreHorizontal,
  Globe, CheckCircle, Star
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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

type SchemeDB = {
  id: string;
  title: string;
  country: string;
  category: string;
  sector: string | null;
  description: string | null;
  benefits: string | null;
  estimated_benefit: string | null;
  eligibility_tags: string[] | null;
  official_url: string | null;
  circular_url: string | null;
  application_deadline: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
};

const emptyForm = {
  title: '', country: '', category: '', sector: '', description: '',
  benefits: '', estimated_benefit: '', eligibility_tags: '',
  official_url: '', circular_url: '', application_deadline: '',
  is_active: true, is_featured: false,
};

export default function AdminSchemesDB() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: schemes, isLoading } = useQuery({
    queryKey: ['admin-schemes-db'],
    queryFn: async () => {
      const { data, error } = await supabase.from('government_schemes_db').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as SchemeDB[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: typeof form) => {
      const payload = {
        title: values.title,
        country: values.country,
        category: values.category,
        sector: values.sector || null,
        description: values.description || null,
        benefits: values.benefits || null,
        estimated_benefit: values.estimated_benefit || null,
        eligibility_tags: values.eligibility_tags ? values.eligibility_tags.split(',').map(t => t.trim()) : [],
        official_url: values.official_url || null,
        circular_url: values.circular_url || null,
        application_deadline: values.application_deadline || null,
        is_active: values.is_active,
        is_featured: values.is_featured,
      };
      if (editId) {
        const { error } = await supabase.from('government_schemes_db').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('government_schemes_db').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? 'Scheme updated' : 'Scheme created');
      queryClient.invalidateQueries({ queryKey: ['admin-schemes-db'] });
      closeDialog();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('government_schemes_db').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Scheme deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-schemes-db'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openCreate = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: SchemeDB) => {
    setEditId(s.id);
    setForm({
      title: s.title, country: s.country, category: s.category,
      sector: s.sector || '', description: s.description || '',
      benefits: s.benefits || '', estimated_benefit: s.estimated_benefit || '',
      eligibility_tags: s.eligibility_tags?.join(', ') || '',
      official_url: s.official_url || '', circular_url: s.circular_url || '',
      application_deadline: s.application_deadline || '',
      is_active: s.is_active ?? true, is_featured: s.is_featured ?? false,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditId(null); setForm(emptyForm); };

  const filtered = schemes?.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.country.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schemes Database</h1>
          <p className="text-muted-foreground">Manage government incentive schemes across countries</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" />Add Scheme</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Schemes', val: schemes?.length || 0, icon: Landmark, color: 'text-primary' },
          { label: 'Active', val: schemes?.filter(s => s.is_active).length || 0, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Featured', val: schemes?.filter(s => s.is_featured).length || 0, icon: Star, color: 'text-amber-600' },
          { label: 'Countries', val: new Set(schemes?.map(s => s.country)).size, icon: Globe, color: 'text-blue-600' },
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
        <Input placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4"><CardTitle className="text-lg">All Government Schemes</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !filtered?.length ? (
            <p className="text-center py-8 text-muted-foreground">No schemes found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium max-w-[250px]">
                      <p className="truncate">{s.title}</p>
                      {s.is_featured && <Badge variant="secondary" className="text-xs mt-1">Featured</Badge>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{s.country}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                    <TableCell>{s.sector || '-'}</TableCell>
                    <TableCell className="text-sm">{s.application_deadline || '-'}</TableCell>
                    <TableCell>{s.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(s)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(s.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Government Scheme</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Country *</Label><Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="e.g., India" /></div>
              <div className="grid gap-2"><Label>Category *</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g., Export Promotion" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Sector</Label><Input value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Estimated Benefit</Label><Input value={form.estimated_benefit} onChange={e => setForm(p => ({ ...p, estimated_benefit: e.target.value }))} placeholder="e.g., Up to 5% of FOB value" /></div>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
            <div className="grid gap-2"><Label>Benefits</Label><Textarea value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} rows={2} /></div>
            <div className="grid gap-2"><Label>Eligibility Tags (comma-separated)</Label><Input value={form.eligibility_tags} onChange={e => setForm(p => ({ ...p, eligibility_tags: e.target.value }))} placeholder="e.g., SME, MSME, Manufacturer" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Official URL</Label><Input value={form.official_url} onChange={e => setForm(p => ({ ...p, official_url: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Application Deadline</Label><Input type="date" value={form.application_deadline} onChange={e => setForm(p => ({ ...p, application_deadline: e.target.value }))} /></div>
            </div>
            <div className="grid gap-2"><Label>Circular URL</Label><Input value={form.circular_url} onChange={e => setForm(p => ({ ...p, circular_url: e.target.value }))} /></div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))} /><Label>Featured</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => upsert.mutate(form)} disabled={!form.title || !form.country || !form.category || upsert.isPending}>
              {editId ? 'Save Changes' : 'Create Scheme'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
