import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
  tags: string[] | null;
  published_at: string | null;
}

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      setPost(data as BlogPost | null);
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
        ) : !post ? (
          <div className="text-center py-32">
            <h1 className="text-2xl font-display font-bold mb-2">Article Not Found</h1>
            <Link to="/blog" className="text-primary hover:underline text-sm">← Back to Blog</Link>
          </div>
        ) : (
          <article>
            {post.cover_image_url && (
              <div className="h-64 md:h-96 bg-muted border-b border-border">
                <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="container mx-auto px-4 lg:px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
                  <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>
                <Badge variant="outline" className="mb-3 capitalize">{post.category || "General"}</Badge>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                  {post.author_name && (
                    <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author_name}</span>
                  )}
                  {post.published_at && (
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(post.published_at), "MMMM d, yyyy")}</span>
                  )}
                </div>
                <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border flex items-center gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
