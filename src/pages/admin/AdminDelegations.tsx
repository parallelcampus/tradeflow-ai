import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Globe,
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const delegations = [
  {
    id: '1',
    title: 'Gulf Food Expo 2025 - Dubai Trade Delegation',
    destination: 'Dubai, UAE',
    startDate: '2025-02-20',
    endDate: '2025-02-26',
    industry: 'Food & Beverages',
    totalSlots: 25,
    registeredSlots: 18,
    price: 125000,
    status: 'open',
    organizer: 'FIEO Western Region',
  },
  {
    id: '2',
    title: 'Africa Trade Mission - Kenya & Tanzania',
    destination: 'Nairobi & Dar es Salaam',
    startDate: '2025-03-15',
    endDate: '2025-03-22',
    industry: 'Textiles & Engineering',
    totalSlots: 20,
    registeredSlots: 12,
    price: 145000,
    status: 'open',
    organizer: 'EEPC India',
  },
  {
    id: '3',
    title: 'ASEAN Business Summit - Singapore',
    destination: 'Singapore',
    startDate: '2025-04-10',
    endDate: '2025-04-14',
    industry: 'IT & Electronics',
    totalSlots: 30,
    registeredSlots: 28,
    price: 98000,
    status: 'almost_full',
    organizer: 'CII',
  },
];

export default function AdminDelegations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredDelegations = delegations.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDelegation = () => {
    toast.success('Delegation created successfully!');
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast.success('Delegation deleted successfully!');
  };

  const getStatusBadge = (status: string, registered: number, total: number) => {
    const percentage = (registered / total) * 100;
    if (status === 'almost_full' || percentage >= 80) {
      return <Badge variant="destructive">Almost Full</Badge>;
    }
    if (percentage >= 50) {
      return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">Filling Fast</Badge>;
    }
    return <Badge variant="secondary">Open</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trade Delegations</h1>
          <p className="text-muted-foreground">Manage trade delegation programs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Delegation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Delegation</DialogTitle>
              <DialogDescription>Add a new trade delegation program</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Delegation Title</Label>
                <Input placeholder="e.g., Gulf Food Expo 2025 - Dubai Trade Delegation" />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea placeholder="Delegation description and highlights..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Destination</Label>
                  <Input placeholder="e.g., Dubai, UAE" />
                </div>
                <div className="grid gap-2">
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                      <SelectItem value="it">IT & Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Total Slots</Label>
                  <Input type="number" placeholder="25" />
                </div>
                <div className="grid gap-2">
                  <Label>Price per Person (₹)</Label>
                  <Input type="number" placeholder="125000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Organizer</Label>
                <Input placeholder="e.g., FIEO Western Region" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDelegation}>Create Delegation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{delegations.length}</p>
              <p className="text-sm text-muted-foreground">Active Delegations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Countries Covered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">58</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">17</p>
              <p className="text-sm text-muted-foreground">Slots Available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search delegations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Delegations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDelegations.map((delegation) => (
                <TableRow key={delegation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{delegation.title}</p>
                      <p className="text-xs text-muted-foreground">{delegation.organizer}</p>
                    </div>
                  </TableCell>
                  <TableCell>{delegation.destination}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(delegation.startDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">to {new Date(delegation.endDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{delegation.industry}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{delegation.registeredSlots}/{delegation.totalSlots}</span>
                      </div>
                      <Progress value={(delegation.registeredSlots / delegation.totalSlots) * 100} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>₹{delegation.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {getStatusBadge(delegation.status, delegation.registeredSlots, delegation.totalSlots)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          View Registrations
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(delegation.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
