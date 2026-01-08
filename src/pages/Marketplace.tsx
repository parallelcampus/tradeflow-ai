import { useState } from 'react';
import { Search, Filter, Grid, List, Star, MapPin, Package, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const products = [
  {
    id: 1,
    name: 'Premium Cotton Textiles',
    seller: 'Gujarat Textiles Ltd',
    location: 'Ahmedabad, India',
    category: 'Textiles',
    price: '$2.50 - $5.00 / meter',
    moq: '1000 meters',
    rating: 4.8,
    verified: true,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Organic Spices Collection',
    seller: 'Kerala Spices Export',
    location: 'Kochi, India',
    category: 'Food & Beverage',
    price: '$8.00 - $15.00 / kg',
    moq: '100 kg',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'LED Lighting Solutions',
    seller: 'BrightTech Electronics',
    location: 'Shenzhen, China',
    category: 'Electronics',
    price: '$1.20 - $8.00 / unit',
    moq: '500 units',
    rating: 4.6,
    verified: true,
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop',
  },
  {
    id: 4,
    name: 'Handcrafted Leather Goods',
    seller: 'Kanpur Leather Works',
    location: 'Kanpur, India',
    category: 'Fashion',
    price: '$15.00 - $50.00 / piece',
    moq: '50 pieces',
    rating: 4.7,
    verified: false,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=200&fit=crop',
  },
];

const rfqs = [
  {
    id: 1,
    title: 'Cotton Fabric - 50,000 meters',
    buyer: 'Fashion Retail Co.',
    country: 'United States',
    budget: '$100,000 - $150,000',
    deadline: '2026-02-15',
    responses: 12,
  },
  {
    id: 2,
    title: 'Electronic Components Bulk Order',
    buyer: 'TechMart Industries',
    country: 'Germany',
    budget: '$250,000 - $400,000',
    deadline: '2026-01-30',
    responses: 8,
  },
  {
    id: 3,
    title: 'Organic Food Products',
    buyer: 'HealthyLife Stores',
    country: 'UAE',
    budget: '$50,000 - $75,000',
    deadline: '2026-02-28',
    responses: 15,
  },
];

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">B2B Marketplace</h1>
          <p className="text-muted-foreground">
            Browse products, connect with sellers, and respond to RFQs
          </p>
        </div>
        <Button>
          List Your Products <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products, sellers, or categories..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-muted' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-muted' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className={viewMode === 'grid' 
            ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'space-y-4'
          }>
            {products.map((product) => (
              <Card key={product.id} className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.verified && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                      Verified
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.seller}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{product.price}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      MOQ: {product.moq}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rfqs">
          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <Card key={rfq.id} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{rfq.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rfq.buyer} • {rfq.country}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-semibold text-primary">{rfq.budget}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-medium">{rfq.deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Responses</p>
                        <p className="font-medium">{rfq.responses}</p>
                      </div>
                      <Button>Respond</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sellers">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Verified Sellers Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Seller directory coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
