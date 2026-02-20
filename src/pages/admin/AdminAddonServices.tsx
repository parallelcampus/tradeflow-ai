import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Search, Edit, Trash2, MoreHorizontal, Package, Settings
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminAddonServices() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', category: 'general', description: '', price: '', currency: 'USD', icon: '', is_active: true, sort_order: '0' });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['addon-services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('addon_services').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: any) => {
      const payload = {
        name: f.name, category: f.category, description: f.description || null,
        price: f.price ? parseFloat(f.price) : null, currency: f.currency,
        icon: f.icon || null, is_active: f.is_active, sort_order: parseInt(f.sort_order) || 0,
      };
      if (editItem) {
        const { error } = await supabase.from('addon_services').update(payload).eq('id', editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('addon_services').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addon-services'] });
      toast.success(editItem ? 'Service updated' : 'Service created');
      setIsDialogOpen(false);
      setEditItem(null);
    },
    onError: () => toast.error('Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('addon_services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addon-services'] });
      toast.success('Service deleted');
    },
  });

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      name: item.name, category: item.category, description: item.description || '',
      price: item.price?.toString() || '', currency: item.currency || 'USD',
      icon: item.icon || '', is_active: item.is_active, sort_order: item.sort_order?.toString() || '0',
    });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditItem(null);
    setForm({ name: '', category: 'general', description: '', price: '', currency: 'USD', icon: '', is_active: true, sort_order: '0' });
    setIsDialogOpen(true);
  };

  const filtered = services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add-On Services</h1>
        <p className="text-muted-foreground">Manage selectable add-on services for trade and tourism</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total Services', value: services.length, icon: Package },
          { label: 'Active', value: services.filter(s => s.is_active).length, icon: Settings },
          { label: 'Categories', value: new Set(services.map(s => s.category)).size, icon: Settings },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted"><stat.icon className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add Service</Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(svc => (
                  <TableRow key={svc.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{svc.name}</p>
                        {svc.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{svc.description}</p>}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{svc.category}</Badge></TableCell>
                    <TableCell>{svc.price ? `${svc.currency} ${svc.price}` : '—'}</TableCell>
                    <TableCell><Badge variant={svc.is_active ? 'default' : 'secondary'}>{svc.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell>{svc.sort_order}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(svc)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(svc.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Service' : 'Add Service'}</DialogTitle>
            <DialogDescription>Configure the add-on service details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Visa Assistance" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="tourism">Tourism</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Currency</Label>
                <Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name}>{editItem ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
