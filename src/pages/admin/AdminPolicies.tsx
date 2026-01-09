import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Landmark,
  Building2,
  Globe,
  Sparkles,
  Loader2,
  ExternalLink,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { firecrawlApi } from '@/lib/api/firecrawl';

// Sample data for policies
const initialCentralPolicies = [
  {
    id: '1',
    title: 'Foreign Trade Policy 2023-28',
    ministry: 'Ministry of Commerce & Industry',
    description: 'Comprehensive policy framework for promoting exports and regulating imports.',
    category: 'Trade Policy',
    effectiveDate: '2023-04-01',
    documentUrl: 'https://dgft.gov.in',
    status: 'active',
    highlights: ['Remission of Duties and Taxes', 'Export Promotion Capital Goods', 'Advance Authorization']
  },
  {
    id: '2',
    title: 'RODTEP Scheme',
    ministry: 'Ministry of Commerce & Industry',
    description: 'Remission of Duties and Taxes on Exported Products - refund of embedded taxes.',
    category: 'Export Incentive',
    effectiveDate: '2021-01-01',
    documentUrl: 'https://dgft.gov.in',
    status: 'active',
    highlights: ['Refund of central taxes', 'State taxes refund', 'Electronic credit ledger']
  },
  {
    id: '3',
    title: 'Production Linked Incentive (PLI)',
    ministry: 'Multiple Ministries',
    description: 'Incentives for boosting domestic manufacturing and exports across 14 sectors.',
    category: 'Manufacturing',
    effectiveDate: '2020-03-01',
    documentUrl: 'https://pib.gov.in',
    status: 'active',
    highlights: ['14 key sectors', 'INR 1.97 lakh crore outlay', '5-year incentive period']
  },
];

const initialStatePolicies = [
  {
    id: '1',
    state: 'Gujarat',
    title: 'Gujarat Export Policy 2022-27',
    department: 'Industries & Mines Department',
    description: 'Comprehensive export promotion policy with incentives for MSMEs.',
    category: 'Export Policy',
    effectiveDate: '2022-04-01',
    status: 'active',
    highlights: ['50% subsidy on trade fairs', 'Interest subsidy 5%']
  },
  {
    id: '2',
    state: 'Maharashtra',
    title: 'Maharashtra Export Promotion Policy',
    department: 'Industries Department',
    description: 'State support for export-oriented units and new exporters.',
    category: 'Export Policy',
    effectiveDate: '2023-01-01',
    status: 'active',
    highlights: ['SGST reimbursement', 'Export credit support']
  },
  {
    id: '3',
    state: 'Tamil Nadu',
    title: 'Tamil Nadu MSME Policy 2021',
    department: 'MSME Department',
    description: 'Support for MSME exporters including subsidies and infrastructure.',
    category: 'MSME',
    effectiveDate: '2021-10-01',
    status: 'active',
    highlights: ['Capital subsidy 25%', 'Technology upgrade support']
  },
];

const governmentSources = [
  { name: 'DGFT', url: 'https://dgft.gov.in', description: 'Foreign Trade Policy & Notifications' },
  { name: 'Ministry of Commerce', url: 'https://commerce.gov.in', description: 'Trade Policies & Schemes' },
  { name: 'PIB India', url: 'https://pib.gov.in', description: 'Press Information Bureau' },
  { name: 'ECGC', url: 'https://ecgc.in', description: 'Export Credit Insurance' },
  { name: 'RBI', url: 'https://rbi.org.in', description: 'Trade Finance Guidelines' },
  { name: 'MSME Ministry', url: 'https://msme.gov.in', description: 'MSME Schemes' },
];

const statePortals = [
  { state: 'Gujarat', url: 'https://ic.gujarat.gov.in', department: 'Industries Commissionerate' },
  { state: 'Maharashtra', url: 'https://maitri.mahaonline.gov.in', department: 'Industries Dept' },
  { state: 'Tamil Nadu', url: 'https://msme.tn.gov.in', department: 'MSME Department' },
  { state: 'Karnataka', url: 'https://kum.karnataka.gov.in', department: 'Commerce & Industries' },
  { state: 'Uttar Pradesh', url: 'https://invest.up.gov.in', department: 'Invest UP' },
];

export default function AdminPolicies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'central' | 'state'>('central');
  const [centralPolicies, setCentralPolicies] = useState(initialCentralPolicies);
  const [statePolicies, setStatePolicies] = useState(initialStatePolicies);
  const [isScrapingUrl, setIsScrapingUrl] = useState('');
  const [scrapedContent, setScrapedContent] = useState<string | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Form state for adding policy
  const [formData, setFormData] = useState({
    title: '',
    ministry: '',
    department: '',
    state: '',
    description: '',
    category: '',
    effectiveDate: '',
    documentUrl: '',
    highlights: ''
  });

  const handleAddPolicy = () => {
    const newPolicy = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      effectiveDate: formData.effectiveDate,
      documentUrl: formData.documentUrl,
      status: 'active',
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(Boolean),
      ...(policyType === 'central' 
        ? { ministry: formData.ministry }
        : { state: formData.state, department: formData.department }
      )
    };

    if (policyType === 'central') {
      setCentralPolicies([...centralPolicies, newPolicy as any]);
    } else {
      setStatePolicies([...statePolicies, newPolicy as any]);
    }

    toast.success(`${policyType === 'central' ? 'Central' : 'State'} policy added successfully!`);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      ministry: '',
      department: '',
      state: '',
      description: '',
      category: '',
      effectiveDate: '',
      documentUrl: '',
      highlights: ''
    });
  };

  const handleDelete = (id: string, type: 'central' | 'state') => {
    if (type === 'central') {
      setCentralPolicies(centralPolicies.filter(p => p.id !== id));
    } else {
      setStatePolicies(statePolicies.filter(p => p.id !== id));
    }
    toast.success('Policy deleted successfully!');
  };

  const handleAIScrape = async (url: string, sourceName: string) => {
    setIsScraping(true);
    setIsScrapingUrl(url);
    setSelectedSource(sourceName);
    setScrapedContent(null);

    try {
      const response = await firecrawlApi.scrape(url, {
        formats: ['markdown'],
        onlyMainContent: true,
      });

      if (response.success && response.data) {
        const markdown = response.data.markdown || response.data?.data?.markdown;
        setScrapedContent(markdown || 'Content scraped but no text found.');
        toast.success(`Successfully scraped content from ${sourceName}`);
      } else {
        toast.error(response.error || 'Failed to scrape content');
        setScrapedContent('Failed to fetch content. Please try again.');
      }
    } catch (error) {
      console.error('Scrape error:', error);
      toast.error('Failed to connect to scraping service');
      setScrapedContent('Error connecting to service. Make sure Firecrawl is configured.');
    } finally {
      setIsScraping(false);
    }
  };

  const extractPolicyFromContent = () => {
    if (!scrapedContent) return;
    
    // In a real implementation, this would use AI to extract structured data
    // For now, we'll show a toast indicating the feature
    toast.info('AI extraction would parse this content and auto-fill the policy form. Coming soon!');
    setIsAIDialogOpen(false);
    setIsAddDialogOpen(true);
  };

  const filteredCentralPolicies = centralPolicies.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ministry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStatePolicies = statePolicies.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Government Policies</h1>
          <p className="text-muted-foreground">Manage central and state government export policies</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Fetch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Policy Fetcher
                </DialogTitle>
                <DialogDescription>
                  Automatically fetch and extract policy information from government websites
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Government Sources */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    Central Government Sources
                  </h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {governmentSources.map((source) => (
                      <Card 
                        key={source.name} 
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedSource === source.name ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => !isScraping && handleAIScrape(source.url, source.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{source.name}</p>
                              <p className="text-xs text-muted-foreground">{source.description}</p>
                            </div>
                            {isScraping && selectedSource === source.name ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* State Portals */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    State Government Portals
                  </h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {statePortals.map((portal) => (
                      <Card 
                        key={portal.state}
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedSource === portal.state ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => !isScraping && handleAIScrape(portal.url, portal.state)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{portal.state}</p>
                              <p className="text-xs text-muted-foreground">{portal.department}</p>
                            </div>
                            {isScraping && selectedSource === portal.state ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Custom URL */}
                <div>
                  <h4 className="font-medium mb-3">Custom URL</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter any government website URL..."
                      value={isScrapingUrl}
                      onChange={(e) => setIsScrapingUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleAIScrape(isScrapingUrl, 'Custom URL')}
                      disabled={isScraping || !isScrapingUrl}
                    >
                      {isScraping ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Scraped Content Preview */}
                {scrapedContent && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Scraped Content</h4>
                      <Button size="sm" onClick={extractPolicyFromContent}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Extract Policy Data
                      </Button>
                    </div>
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <pre className="text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">
                          {scrapedContent.substring(0, 3000)}
                          {scrapedContent.length > 3000 && '...'}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Policy</DialogTitle>
                <DialogDescription>Add a central or state government policy</DialogDescription>
              </DialogHeader>
              <Tabs value={policyType} onValueChange={(v) => setPolicyType(v as 'central' | 'state')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="central">Central Government</TabsTrigger>
                  <TabsTrigger value="state">State Government</TabsTrigger>
                </TabsList>
                <TabsContent value="central" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Policy Title</Label>
                      <Input 
                        placeholder="e.g., Foreign Trade Policy 2023-28" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Ministry/Department</Label>
                      <Input 
                        placeholder="e.g., Ministry of Commerce & Industry" 
                        value={formData.ministry}
                        onChange={(e) => setFormData({...formData, ministry: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Policy description..." 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Trade Policy">Trade Policy</SelectItem>
                            <SelectItem value="Export Incentive">Export Incentive</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Insurance">Insurance</SelectItem>
                            <SelectItem value="MSME">MSME</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Effective Date</Label>
                        <Input 
                          type="date" 
                          value={formData.effectiveDate}
                          onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Document URL</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.documentUrl}
                        onChange={(e) => setFormData({...formData, documentUrl: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Key Highlights (comma-separated)</Label>
                      <Textarea 
                        placeholder="Highlight 1, Highlight 2, Highlight 3..." 
                        value={formData.highlights}
                        onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="state" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Policy Title</Label>
                      <Input 
                        placeholder="e.g., Gujarat Export Policy 2022-27" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>State</Label>
                        <Select value={formData.state} onValueChange={(v) => setFormData({...formData, state: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="West Bengal">West Bengal</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Department</Label>
                        <Input 
                          placeholder="e.g., Industries Department" 
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Policy description..." 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Export Policy">Export Policy</SelectItem>
                            <SelectItem value="Industrial Policy">Industrial Policy</SelectItem>
                            <SelectItem value="MSME">MSME</SelectItem>
                            <SelectItem value="Investment">Investment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Effective Date</Label>
                        <Input 
                          type="date" 
                          value={formData.effectiveDate}
                          onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Key Highlights (comma-separated)</Label>
                      <Textarea 
                        placeholder="Highlight 1, Highlight 2, Highlight 3..." 
                        value={formData.highlights}
                        onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddPolicy}>Add Policy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Landmark className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{centralPolicies.length}</p>
              <p className="text-sm text-muted-foreground">Central Policies</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statePolicies.length}</p>
              <p className="text-sm text-muted-foreground">State Policies</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{centralPolicies.length + statePolicies.length}</p>
              <p className="text-sm text-muted-foreground">Total Policies</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">AI</p>
              <p className="text-sm text-muted-foreground">Auto-Fetch Ready</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="central" className="space-y-4">
        <TabsList>
          <TabsTrigger value="central" className="gap-2">
            <Landmark className="h-4 w-4" />
            Central Policies
          </TabsTrigger>
          <TabsTrigger value="state" className="gap-2">
            <Building2 className="h-4 w-4" />
            State Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="central">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Central Government Policies</CardTitle>
              <CardDescription>Policies from Ministry of Commerce, DGFT, and other central bodies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Ministry</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCentralPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{policy.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{policy.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{policy.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{policy.ministry}</TableCell>
                      <TableCell>{new Date(policy.effectiveDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                          {policy.status}
                        </Badge>
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
                              View
                            </DropdownMenuItem>
                            {policy.documentUrl && (
                              <DropdownMenuItem asChild>
                                <a href={policy.documentUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Source
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(policy.id, 'central')}
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
        </TabsContent>

        <TabsContent value="state">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">State Government Policies</CardTitle>
              <CardDescription>Export promotion policies from various state governments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatePolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{policy.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{policy.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-600 border-green-200">
                          {policy.state}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{policy.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">{policy.department}</TableCell>
                      <TableCell>{new Date(policy.effectiveDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                          {policy.status}
                        </Badge>
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
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(policy.id, 'state')}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
