import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  author_name: string | null;
  published_at: string | null;
  is_featured: boolean | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, category, author_name, published_at, is_featured, created_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setPosts((data as BlogPost[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const featured = posts.find((p) => p.is_featured);
  const regular = posts.filter((p) => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-border py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm mb-6">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AITAS Blog</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                Trade Insights & <span className="text-primary">Industry Analysis</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Expert perspectives on international trade, medical tourism, government schemes, and global market trends from the AITAS team.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Coming Soon</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our editorial team is preparing insightful articles on trade, healthcare, and global markets. Check back soon.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featured && (
                  <div className="mb-12">
                    <Card className="border overflow-hidden hover:border-primary/30 transition-colors">
                      <div className="grid lg:grid-cols-2">
                        {featured.cover_image_url && (
                          <div className="h-64 lg:h-auto bg-muted">
                            <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <CardContent className="p-8 flex flex-col justify-center">
                          <Badge variant="outline" className="w-fit mb-3 capitalize">{featured.category || "General"}</Badge>
                          <h2 className="text-2xl font-serif font-bold text-foreground mb-3">{featured.title}</h2>
                          <p className="text-muted-foreground mb-4 line-clamp-3">{featured.excerpt}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {featured.author_name && <span>By {featured.author_name}</span>}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {featured.published_at ? format(new Date(featured.published_at), "MMM d, yyyy") : ""}
                            </span>
                          </div>
                          <Link to={`/blog/${featured.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                            Read Article <ArrowRight className="h-4 w-4" />
                          </Link>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Regular Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((post) => (
                    <Card key={post.id} className="border overflow-hidden hover:border-primary/30 transition-colors">
                      {post.cover_image_url && (
                        <div className="h-48 bg-muted">
                          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <Badge variant="outline" className="mb-2 capitalize text-[10px]">{post.category || "General"}</Badge>
                        <h3 className="text-lg font-serif font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.author_name}</span>
                          <span>{post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : ""}</span>
                        </div>
                        <Link to={`/blog/${post.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                          Read More <ArrowRight className="h-3 w-3" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
