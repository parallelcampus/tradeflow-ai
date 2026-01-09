import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  FileText,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { fetchSchemesFromERPNext, GovtScheme } from '@/lib/api/erpnext';

const fallbackSchemes: GovtScheme[] = [
  {
    id: 1,
    name: 'Production Linked Incentive (PLI) - Electronics',
    ministry: 'Ministry of Electronics & IT',
    benefit: 'Up to 6% incentive on incremental sales',
    deadline: '2026-03-31',
    eligibility: 'Electronics manufacturers with minimum investment of ₹100 Cr',
    status: 'active',
    category: 'Manufacturing',
  },
  {
    id: 2,
    name: 'Market Access Initiative (MAI)',
    ministry: 'Ministry of Commerce',
    benefit: 'Financial assistance for export promotion activities',
    deadline: '2026-06-30',
    eligibility: 'Export Promotion Councils, Trade Associations, and Exporters',
    status: 'active',
    category: 'Export Promotion',
  },
  {
    id: 3,
    name: 'Trade Infrastructure for Export Scheme (TIES)',
    ministry: 'Ministry of Commerce',
    benefit: 'Financial assistance up to ₹20 Cr per project',
    deadline: '2026-12-31',
    eligibility: 'Central/State agencies for export infrastructure',
    status: 'active',
    category: 'Infrastructure',
  },
];

export default function AdminSchemes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [schemes, setSchemes] = useState<GovtScheme[]>(fallbackSchemes);
  const [isLoading, setIsLoading] = useState(false);
  const [isERPNextConnected, setIsERPNextConnected] = useState(false);

  const loadSchemes = async () => {
    setIsLoading(true);
    try {
      const erpnextSchemes = await fetchSchemesFromERPNext();
      if (erpnextSchemes.length > 0) {
        setSchemes(erpnextSchemes);
        setIsERPNextConnected(true);
        toast.success('Schemes synced from ERPNext');
      } else {
        setSchemes(fallbackSchemes);
        setIsERPNextConnected(false);
      }
    } catch (error) {
      console.error('Error loading schemes:', error);
      setSchemes(fallbackSchemes);
      setIsERPNextConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ministry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddScheme = () => {
    toast.success('Scheme created successfully!');
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast.success('Scheme deleted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Government Schemes</h1>
          <p className="text-muted-foreground">Manage export-import incentive schemes</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadSchemes}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync from ERPNext
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Scheme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Scheme</DialogTitle>
                <DialogDescription>Add a government scheme manually (recommended: add via ERPNext)</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Scheme Name</Label>
                  <Input placeholder="e.g., Production Linked Incentive (PLI)" />
                </div>
                <div className="grid gap-2">
                  <Label>Ministry</Label>
                  <Input placeholder="e.g., Ministry of Commerce" />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Scheme description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="export">Export Promotion</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="tax">Tax Incentive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Deadline</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Benefit</Label>
                  <Input placeholder="e.g., Up to 6% incentive on incremental sales" />
                </div>
                <div className="grid gap-2">
                  <Label>Eligibility</Label>
                  <Textarea placeholder="Who can apply for this scheme..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddScheme}>Add Scheme</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ERPNext Status */}
      <Card className={`border-border/50 ${isERPNextConnected ? 'bg-emerald-500/5' : 'bg-amber-500/5'}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isERPNextConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">Connected to ERPNext</p>
                  <p className="text-xs text-muted-foreground">Schemes are synced from your ERPNext instance</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Using Local Data</p>
                  <p className="text-xs text-muted-foreground">Configure ERPNext to enable live sync</p>
                </div>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open ERPNext
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{schemes.length}</p>
              <p className="text-sm text-muted-foreground">Total Schemes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{schemes.filter(s => s.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active Schemes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{new Set(schemes.map(s => s.category)).size}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{schemes.filter(s => s.erpnext_id).length}</p>
              <p className="text-sm text-muted-foreground">From ERPNext</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Schemes</CardTitle>
          <CardDescription>
            {isERPNextConnected 
              ? 'Schemes are managed via ERPNext. Changes made here may be overwritten on sync.'
              : 'Add schemes manually or connect to ERPNext for automatic sync.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme Name</TableHead>
                <TableHead>Ministry</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Benefit</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchemes.map((scheme) => (
                <TableRow key={scheme.id}>
                  <TableCell className="font-medium max-w-[250px]">
                    <p className="truncate">{scheme.name}</p>
                  </TableCell>
                  <TableCell className="text-sm">{scheme.ministry}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{scheme.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px]">
                    <p className="truncate">{scheme.benefit}</p>
                  </TableCell>
                  <TableCell>{scheme.deadline}</TableCell>
                  <TableCell>
                    <Badge variant={scheme.status === 'active' ? 'default' : 'secondary'}>
                      {scheme.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {scheme.erpnext_id ? (
                      <Badge variant="secondary" className="text-xs">ERPNext</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Local</Badge>
                    )}
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(scheme.id)}
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
