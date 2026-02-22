import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar, ArrowRight, Loader2, Image } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import type { Json } from "@/integrations/supabase/types";

interface PhotoItem {
  url: string;
  caption?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  cover_image_url: string | null;
  photo_gallery: Json | null;
  category: string | null;
  source: string | null;
  published_at: string | null;
  is_featured: boolean | null;
  created_at: string;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("news_articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setArticles((data as NewsArticle[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))];
  const filtered = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  const asPhotos = (val: Json | null): PhotoItem[] => {
    if (!val || !Array.isArray(val)) return [];
    return val as unknown as PhotoItem[];
  };

  // Collect all photos for the gallery strip
  const allPhotos = articles.flatMap((a) =>
    asPhotos(a.photo_gallery).map((p) => ({
      ...p,
      articleTitle: a.title,
      date: a.published_at || a.created_at,
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm mb-6">
                <Newspaper className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AITAS News</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                News & <span className="text-primary">Photo Gallery</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Latest news, event coverage, and daily photographs from AITAS delegations, trade events, and partner activities worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Daily Photo Gallery Strip */}
        {allPhotos.length > 0 && (
          <section className="border-b border-border py-8 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center gap-2 mb-4">
                <Image className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-display font-bold text-foreground">Daily Photo Gallery</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allPhotos.slice(0, 12).map((photo, i) => (
                  <div key={i} className="flex-shrink-0 w-52 group">
                    <div className="h-36 rounded-sm overflow-hidden bg-muted border border-border">
                      <img src={photo.url} alt={photo.caption || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {photo.caption && (
                      <p className="text-xs text-muted-foreground mt-1.5 truncate">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <section className="border-b border-border sticky top-20 bg-background z-20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex gap-0 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    !selectedCategory ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat!)}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap capitalize ${
                      selectedCategory === cat ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* News Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">No News Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Stay tuned for the latest news, event reports, and photo coverage from AITAS activities.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filtered.map((article) => (
                  <Card key={article.id} className="border overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="grid md:grid-cols-3">
                      {article.cover_image_url && (
                        <div className="h-48 md:h-auto bg-muted">
                          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardContent className={`p-6 flex flex-col justify-center ${article.cover_image_url ? "md:col-span-2" : "md:col-span-3"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize text-[10px]">{article.category || "General"}</Badge>
                          {article.source && <span className="text-xs text-muted-foreground">Source: {article.source}</span>}
                        </div>
                        <h3 className="text-xl font-display font-bold text-foreground mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.summary}</p>

                        {/* Inline photo previews */}
                        {(() => {
                          const photos = asPhotos(article.photo_gallery);
                          return photos.length > 0 ? (
                            <div className="flex gap-2 mb-3">
                              {photos.slice(0, 4).map((photo, i) => (
                                <div key={i} className="w-16 h-16 rounded-sm overflow-hidden bg-muted border border-border">
                                  <img src={photo.url} alt={photo.caption || ""} className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {photos.length > 4 && (
                                <div className="w-16 h-16 rounded-sm bg-muted border border-border flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground font-medium">+{photos.length - 4}</span>
                                </div>
                              )}
                            </div>
                          ) : null;
                        })()}

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {article.published_at ? format(new Date(article.published_at), "MMM d, yyyy") : ""}
                          </span>
                          <Link to={`/news/${article.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            Read More <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
