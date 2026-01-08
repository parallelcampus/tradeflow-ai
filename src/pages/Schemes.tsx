import { useState } from 'react';
import { Search, Filter, FileText, Calendar, DollarSign, CheckCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const schemes = [
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
  {
    id: 4,
    name: 'Interest Equalisation Scheme',
    ministry: 'Ministry of Commerce',
    benefit: '3-5% interest subvention on pre/post shipment credit',
    deadline: '2026-09-30',
    eligibility: 'MSME exporters and specific sectors',
    status: 'active',
    category: 'Finance',
  },
  {
    id: 5,
    name: 'Remission of Duties and Taxes (RoDTEP)',
    ministry: 'Ministry of Finance',
    benefit: 'Rebate on embedded taxes in exported products',
    deadline: 'Ongoing',
    eligibility: 'All exporters of eligible products',
    status: 'active',
    category: 'Tax Incentive',
  },
];

const categories = ['All', 'Manufacturing', 'Export Promotion', 'Infrastructure', 'Finance', 'Tax Incentive'];

export default function Schemes() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Government Schemes & Subsidies</h1>
          <p className="text-muted-foreground">
            Explore and apply for export-import incentive schemes
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Eligibility Check
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search schemes by name, ministry..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{schemes.length}</p>
              <p className="text-sm text-muted-foreground">Active Schemes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹5,000 Cr+</p>
              <p className="text-sm text-muted-foreground">Total Benefits</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Ending Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">You're Eligible</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <Badge variant="outline" className="shrink-0">{scheme.category}</Badge>
                    <Badge className="bg-accent/20 text-accent shrink-0">Active</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{scheme.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{scheme.ministry}</p>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Benefit</p>
                        <p className="text-sm">{scheme.benefit}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Eligibility</p>
                        <p className="text-sm">{scheme.eligibility}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="font-medium">{scheme.deadline}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Apply Now <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
