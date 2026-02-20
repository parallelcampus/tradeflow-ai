import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, Download, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserDocument {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string | null;
  description: string | null;
  created_at: string;
}

const categories = [
  "medical_report", "trade_license", "certificate", "invoice",
  "contract", "visa_document", "insurance", "general",
];

export default function MyDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");

  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("user_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setDocuments((data as UserDocument[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("user-documents")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("user-documents")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("user_documents").insert({
      user_id: user.id,
      file_name: file.name,
      file_url: filePath,
      file_type: file.type,
      file_size: file.size,
      category: selectedCategory,
    });

    setUploading(false);
    if (dbError) {
      toast.error("Failed to save document record");
    } else {
      toast.success("Document uploaded successfully");
      fetchDocuments();
    }
    e.target.value = "";
  };

  const handleDelete = async (doc: UserDocument) => {
    await supabase.storage.from("user-documents").remove([doc.file_url]);
    await supabase.from("user_documents").delete().eq("id", doc.id);
    toast.success("Document deleted");
    fetchDocuments();
  };

  const handleDownload = async (doc: UserDocument) => {
    const { data } = await supabase.storage
      .from("user-documents")
      .createSignedUrl(doc.file_url, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">My Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload and manage your trade documents, medical reports, and certificates
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="border border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button asChild disabled={uploading}>
                  <span>
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {uploading ? "Uploading..." : "Upload Document"}
                  </span>
                </Button>
              </label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleUpload}
                disabled={uploading}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            PDF, JPG, PNG, DOC, XLS up to 10MB
          </p>
        </CardContent>
      </Card>

      {/* Documents List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : documents.length === 0 ? (
        <Card className="border">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload medical reports, trade certificates, and other documents.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="border hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {(doc.category || "general").replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatSize(doc.file_size)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(doc.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(doc)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
