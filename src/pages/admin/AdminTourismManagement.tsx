import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Search, Edit, Trash2, Eye, MoreHorizontal, MapPin, Package, Users, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { toast } from 'sonner';

const bookingStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminTourismManagement() {
  const queryClient = useQueryClient();
  const [pkgSearch, setPkgSearch] = useState('');
  const [bkgSearch, setBkgSearch] = useState('');
  const [isPkgDialogOpen, setIsPkgDialogOpen] = useState(false);
  const [editPkg, setEditPkg] = useState<any>(null);
  const [pkgForm, setPkgForm] = useState({ title: '', category: 'pilgrimage', description: '', duration_days: '', price: '', currency: 'USD', max_group_size: '', image_url: '' });

  const { data: packages = [], isLoading: pkgLoading } = useQuery({
    queryKey: ['tourism-packages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tourism_packages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: bookings = [], isLoading: bkgLoading } = useQuery({
    queryKey: ['tourism-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tourism_bookings').select('*, tourism_packages(title)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const pkgMutation = useMutation({
    mutationFn: async (form: any) => {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        duration_days: form.duration_days ? parseInt(form.duration_days) : null,
        price: form.price ? parseFloat(form.price) : null,
        currency: form.currency,
        max_group_size: form.max_group_size ? parseInt(form.max_group_size) : null,
        image_url: form.image_url || null,
      };
      if (editPkg) {
        const { error } = await supabase.from('tourism_packages').update(payload).eq('id', editPkg.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tourism_packages').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-packages'] });
      toast.success(editPkg ? 'Package updated' : 'Package created');
      setIsPkgDialogOpen(false);
      setEditPkg(null);
      setPkgForm({ title: '', category: 'pilgrimage', description: '', duration_days: '', price: '', currency: 'USD', max_group_size: '', image_url: '' });
    },
    onError: () => toast.error('Failed to save package'),
  });

  const deletePkgMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tourism_packages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-packages'] });
      toast.success('Package deleted');
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const updates: any = { status };
      if (admin_notes !== undefined) updates.admin_notes = admin_notes;
      const { error } = await supabase.from('tourism_bookings').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-bookings'] });
      toast.success('Booking updated');
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tourism_bookings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tourism-bookings'] });
      toast.success('Booking deleted');
    },
  });

  const openEditPkg = (pkg: any) => {
    setEditPkg(pkg);
    setPkgForm({
      title: pkg.title, category: pkg.category, description: pkg.description || '',
      duration_days: pkg.duration_days?.toString() || '', price: pkg.price?.toString() || '',
      currency: pkg.currency || 'USD', max_group_size: pkg.max_group_size?.toString() || '', image_url: pkg.image_url || '',
    });
    setIsPkgDialogOpen(true);
  };

  const filteredPkgs = packages.filter(p => p.title.toLowerCase().includes(pkgSearch.toLowerCase()));
  const filteredBkgs = bookings.filter(b =>
    b.client_name.toLowerCase().includes(bkgSearch.toLowerCase()) ||
    b.client_email.toLowerCase().includes(bkgSearch.toLowerCase())
  );

  const getBookingStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-500/20 text-amber-700', approved: 'bg-blue-500/20 text-blue-700',
      confirmed: 'bg-primary/20 text-primary', in_progress: 'bg-purple-500/20 text-purple-700',
      completed: 'bg-green-500/20 text-green-700', cancelled: 'bg-red-500/20 text-red-700',
    };
    return <Badge className={colors[status] || ''}>{bookingStatuses.find(s => s.value === status)?.label || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tourism Management</h1>
        <p className="text-muted-foreground">Manage tour packages and booking requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Packages', value: packages.length, icon: Package, iconColor: 'text-primary' },
          { label: 'Active Packages', value: packages.filter(p => p.is_active).length, icon: MapPin, iconColor: 'text-green-600' },
          { label: 'Total Bookings', value: bookings.length, icon: Calendar, iconColor: 'text-blue-600' },
          { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: Users, iconColor: 'text-amber-600' },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted"><stat.icon className={`h-5 w-5 ${stat.iconColor}`} /></div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="packages">
        <TabsList>
          <TabsTrigger value="packages">Tour Packages</TabsTrigger>
          <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search packages..." value={pkgSearch} onChange={e => setPkgSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={() => { setEditPkg(null); setPkgForm({ title: '', category: 'pilgrimage', description: '', duration_days: '', price: '', currency: 'USD', max_group_size: '', image_url: '' }); setIsPkgDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />Add Package
            </Button>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              {pkgLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPkgs.map(pkg => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.title}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{pkg.category}</Badge></TableCell>
                        <TableCell>{pkg.duration_days ? `${pkg.duration_days} days` : '—'}</TableCell>
                        <TableCell>{pkg.price ? `${pkg.currency} ${pkg.price}` : '—'}</TableCell>
                        <TableCell><Badge variant={pkg.is_active ? 'default' : 'secondary'}>{pkg.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditPkg(pkg)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => deletePkgMutation.mutate(pkg.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." value={bkgSearch} onChange={e => setBkgSearch(e.target.value)} className="pl-9" />
          </div>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              {bkgLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Group Size</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBkgs.map(bkg => (
                      <TableRow key={bkg.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{bkg.client_name}</p>
                            <p className="text-xs text-muted-foreground">{bkg.client_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{(bkg as any).tourism_packages?.title || '—'}</TableCell>
                        <TableCell>{bkg.group_size}</TableCell>
                        <TableCell>{bkg.preferred_dates || '—'}</TableCell>
                        <TableCell>{getBookingStatusBadge(bkg.status || 'pending')}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(bkg.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {bookingStatuses.map(s => (
                                <DropdownMenuItem key={s.value} onClick={() => updateBookingStatus.mutate({ id: bkg.id, status: s.value })}>
                                  Set: {s.label}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteBookingMutation.mutate(bkg.id)}>Delete</DropdownMenuItem>
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
        </TabsContent>
      </Tabs>

      {/* Package Dialog */}
      <Dialog open={isPkgDialogOpen} onOpenChange={setIsPkgDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editPkg ? 'Edit Package' : 'Create Tour Package'}</DialogTitle>
            <DialogDescription>Fill in the package details below</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title *</Label>
              <Input value={pkgForm.title} onChange={e => setPkgForm({ ...pkgForm, title: e.target.value })} placeholder="Package title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={pkgForm.category} onValueChange={v => setPkgForm({ ...pkgForm, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pilgrimage">Pilgrimage</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Duration (days)</Label>
                <Input type="number" value={pkgForm.duration_days} onChange={e => setPkgForm({ ...pkgForm, duration_days: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={pkgForm.description} onChange={e => setPkgForm({ ...pkgForm, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input type="number" value={pkgForm.price} onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Currency</Label>
                <Input value={pkgForm.currency} onChange={e => setPkgForm({ ...pkgForm, currency: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Max Group Size</Label>
                <Input type="number" value={pkgForm.max_group_size} onChange={e => setPkgForm({ ...pkgForm, max_group_size: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPkgDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => pkgMutation.mutate(pkgForm)} disabled={!pkgForm.title}>{editPkg ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
