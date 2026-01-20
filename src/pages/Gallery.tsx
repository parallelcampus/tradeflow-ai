import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Images, Calendar, MapPin, X } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  event_name: string | null;
  event_date: string | null;
  location: string | null;
  is_featured: boolean | null;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GalleryImage[];
    }
  });

  const categories = ["All", ...new Set((images || []).map(img => img.category || "General"))];
  
  const filteredImages = selectedCategory === "All" 
    ? images 
    : images?.filter(img => img.category === selectedCategory);

  // Placeholder images if database is empty
  const placeholderImages: GalleryImage[] = [
    { id: '1', title: 'Trade Delegation to Dubai 2024', description: 'Business meetings with UAE importers', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', category: 'Delegations', event_name: 'Dubai Trade Mission', event_date: '2024-03-15', location: 'Dubai, UAE', is_featured: true },
    { id: '2', title: 'Export Excellence Awards', description: 'Annual awards ceremony for top exporters', image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600', category: 'Events', event_name: 'GTPC Awards 2024', event_date: '2024-02-20', location: 'Mumbai, India', is_featured: true },
    { id: '3', title: 'Training Workshop', description: 'Export documentation training session', image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600', category: 'Training', event_name: 'Export Training', event_date: '2024-01-10', location: 'Delhi, India', is_featured: false },
    { id: '4', title: 'B2B Meeting Session', description: 'Buyer-seller meetings at trade fair', image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600', category: 'B2B Meetings', event_name: 'Trade Connect 2024', event_date: '2024-02-05', location: 'Singapore', is_featured: false },
    { id: '5', title: 'Minister Visit', description: 'Hon. Commerce Minister at GTPC office', image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600', category: 'Events', event_name: 'Ministerial Visit', event_date: '2024-01-25', location: 'New Delhi, India', is_featured: true },
    { id: '6', title: 'Germany Trade Mission', description: 'Delegation meeting German buyers', image_url: 'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=600', category: 'Delegations', event_name: 'Germany Mission', event_date: '2024-03-01', location: 'Frankfurt, Germany', is_featured: false },
  ];

  const displayImages = (filteredImages && filteredImages.length > 0) 
    ? filteredImages 
    : selectedCategory === "All" 
      ? placeholderImages 
      : placeholderImages.filter(img => img.category === selectedCategory);

  const displayCategories = images && images.length > 0 
    ? categories 
    : ["All", "Delegations", "Events", "Training", "B2B Meetings"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Images className="w-3 h-3 mr-1" />
              Photo Gallery
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Moments That Matter
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore our journey through trade delegations, events, training programs, 
              and impactful business meetings across the globe.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {displayCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">Loading gallery...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayImages?.map((image) => (
                  <Card 
                    key={image.id} 
                    className="overflow-hidden border-border hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={image.image_url} 
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {image.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-primary">Featured</Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{image.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {image.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(image.event_date).toLocaleDateString()}
                          </span>
                        )}
                        {image.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {image.location}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedImage?.title}</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div>
                <div className="relative">
                  <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[70vh] object-contain bg-black"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:bg-white/20"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {selectedImage.event_name && (
                      <Badge variant="secondary">{selectedImage.event_name}</Badge>
                    )}
                    {selectedImage.event_date && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedImage.event_date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                    )}
                    {selectedImage.location && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {selectedImage.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Be Part of Our Next Event
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our upcoming trade delegations, events, and training programs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                View Upcoming Events
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Register for Delegation
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
