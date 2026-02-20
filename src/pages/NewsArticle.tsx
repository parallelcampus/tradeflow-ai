import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Loader2, Image } from "lucide-react";
import { format } from "date-fns";

import type { Json } from "@/integrations/supabase/types";

interface PhotoItem {
  url: string;
  caption?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  cover_image_url: string | null;
  photo_gallery: Json | null;
  category: string | null;
  source: string | null;
  published_at: string | null;
}

export default function NewsArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("news_articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      setArticle(data as NewsArticle | null);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !article ? (
          <div className="text-center py-32">
            <h1 className="text-2xl font-serif font-bold mb-2">Article Not Found</h1>
            <Link to="/news" className="text-primary hover:underline text-sm">← Back to News</Link>
          </div>
        ) : (
          <article>
            {article.cover_image_url && (
              <div className="h-64 md:h-96 bg-muted border-b border-border">
                <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="container mx-auto px-4 lg:px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
                  <ArrowLeft className="h-4 w-4" /> Back to News
                </Link>
                <Badge variant="outline" className="mb-3 capitalize">{article.category || "General"}</Badge>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">{article.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                  {article.source && <span>Source: {article.source}</span>}
                  {article.published_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {format(new Date(article.published_at), "MMMM d, yyyy")}
                    </span>
                  )}
                </div>
                <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap mb-8">
                  {article.content}
                </div>

                {/* Photo Gallery */}
                {(() => {
                  const photos = article.photo_gallery && Array.isArray(article.photo_gallery)
                    ? (article.photo_gallery as unknown as PhotoItem[])
                    : [];
                  return photos.length > 0 ? (
                    <div className="border-t border-border pt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Image className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-serif font-bold text-foreground">Photo Gallery</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {photos.map((photo, i) => (
                          <div key={i} className="group">
                            <div className="aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                              <img
                                src={photo.url}
                                alt={photo.caption || `Photo ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {photo.caption && (
                              <p className="text-xs text-muted-foreground mt-1.5">{photo.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
