import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Sparkles,
  Eye,
  EyeOff,
  GripVertical,
  BarChart3,
  Target,
  Tag,
  MousePointerClick,
  FileText,
  Globe,
  TrendingUp,
  Award,
  Landmark,
  Calculator,
  GraduationCap,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CATEGORIES = [
  { value: 'schemes', label: 'Government Schemes', color: 'bg-blue-500' },
  { value: 'buyers', label: 'Buyer Discovery', color: 'bg-green-500' },
  { value: 'documentation', label: 'Documentation', color: 'bg-amber-500' },
  { value: 'policies', label: 'Policies', color: 'bg-purple-500' },
  { value: 'training', label: 'Training', color: 'bg-pink-500' },
  { value: 'consultants', label: 'Consultants', color: 'bg-indigo-500' },
  { value: 'general', label: 'General', color: 'bg-slate-500' },
];

const ICONS = [
  { value: 'Sparkles', label: 'Sparkles', Icon: Sparkles },
  { value: 'FileText', label: 'Document', Icon: FileText },
  { value: 'Globe', label: 'Globe', Icon: Globe },
  { value: 'TrendingUp', label: 'Trending', Icon: TrendingUp },
  { value: 'Award', label: 'Award', Icon: Award },
  { value: 'Landmark', label: 'Landmark', Icon: Landmark },
  { value: 'Calculator', label: 'Calculator', Icon: Calculator },
  { value: 'GraduationCap', label: 'Education', Icon: GraduationCap },
  { value: 'Users', label: 'Users', Icon: Users },
  { value: 'Search', label: 'Search', Icon: Search },
];

const ROLES = [
  { value: 'exporter', label: 'Exporter' },
  { value: 'importer', label: 'Importer' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'consultant', label: 'Consultant' },
];

interface SuggestedQuestion {
  id: string;
  question: string;
  category: string;
  icon: string;
  priority: number;
  is_active: boolean;
  target_roles: string[];
  target_industries: string[] | null;
  click_count: number;
  created_at: string;
  updated_at: string;
}

interface QuestionForm {
  question: string;
  category: string;
  icon: string;
  priority: number;
  is_active: boolean;
  target_roles: string[];
}

const defaultForm: QuestionForm = {
  question: '',
  category: 'general',
  icon: 'Sparkles',
  priority: 0,
  is_active: true,
  target_roles: ['exporter', 'importer', 'buyer', 'seller'],
};

export default function AdminAISuggestions() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SuggestedQuestion | null>(null);
  const [form, setForm] = useState<QuestionForm>(defaultForm);

  // Fetch questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['ai-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_suggested_questions')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as SuggestedQuestion[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: QuestionForm & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('ai_suggested_questions')
          .update({
            question: data.question,
            category: data.category,
            icon: data.icon,
            priority: data.priority,
            is_active: data.is_active,
            target_roles: data.target_roles,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ai_suggested_questions')
          .insert({
            question: data.question,
            category: data.category,
            icon: data.icon,
            priority: data.priority,
            is_active: data.is_active,
            target_roles: data.target_roles,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-suggestions'] });
      setDialogOpen(false);
      setEditingQuestion(null);
      setForm(defaultForm);
      toast.success(editingQuestion ? 'Question updated' : 'Question created');
    },
    onError: (error) => {
      toast.error('Failed to save: ' + error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_suggested_questions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-suggestions'] });
      toast.success('Question deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('ai_suggested_questions')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-suggestions'] });
    },
  });

  const handleEdit = (question: SuggestedQuestion) => {
    setEditingQuestion(question);
    setForm({
      question: question.question,
      category: question.category,
      icon: question.icon,
      priority: question.priority,
      is_active: question.is_active,
      target_roles: question.target_roles || [],
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.question.trim()) {
      toast.error('Question is required');
      return;
    }
    saveMutation.mutate({ ...form, id: editingQuestion?.id });
  };

  const handleRoleToggle = (role: string) => {
    setForm(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role],
    }));
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || q.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: questions.length,
    active: questions.filter(q => q.is_active).length,
    totalClicks: questions.reduce((sum, q) => sum + (q.click_count || 0), 0),
    categories: [...new Set(questions.map(q => q.category))].length,
  };

  const getCategoryBadge = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return (
      <Badge variant="secondary" className="text-xs">
        <span className={`w-2 h-2 rounded-full ${cat?.color || 'bg-slate-500'} mr-1.5`} />
        {cat?.label || category}
      </Badge>
    );
  };

  const getIconComponent = (iconName: string) => {
    const found = ICONS.find(i => i.value === iconName);
    return found ? <found.Icon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Sparkles className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{stats.totalClicks}</p>
              </div>
              <MousePointerClick className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">AI Suggested Questions</CardTitle>
              <CardDescription>Manage questions shown to users in the AI Assistant</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Questions Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Target Roles</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Clicks</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No questions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>
                        <div className="p-2 rounded bg-primary/10 w-fit">
                          {getIconComponent(q.icon)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate font-medium">{q.question}</p>
                      </TableCell>
                      <TableCell>{getCategoryBadge(q.category)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {q.target_roles?.slice(0, 2).map(role => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                          {(q.target_roles?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{q.target_roles.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{q.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium">{q.click_count}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={q.is_active}
                          onCheckedChange={(checked) => toggleMutation.mutate({ id: q.id, is_active: checked })}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(q.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            <DialogDescription>
              Configure the suggested question that will appear in the AI Assistant
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Textarea
                placeholder="e.g., What government schemes are available for textile exporters?"
                value={form.question}
                onChange={(e) => setForm(prev => ({ ...prev, question: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm(prev => ({ ...prev, icon: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICONS.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          <icon.Icon className="h-4 w-4" />
                          {icon.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority (higher = shown first)</Label>
              <Input
                type="number"
                value={form.priority}
                onChange={(e) => setForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Target User Roles</Label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(role => (
                  <div key={role.value} className="flex items-center gap-2">
                    <Checkbox
                      id={role.value}
                      checked={form.target_roles.includes(role.value)}
                      onCheckedChange={() => handleRoleToggle(role.value)}
                    />
                    <Label htmlFor={role.value} className="text-sm font-normal cursor-pointer">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active (visible to users)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
