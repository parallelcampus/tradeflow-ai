import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ColumnConfig {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "textarea";
  required?: boolean;
  placeholder?: string;
}

interface MasterDataTableProps<T> {
  title: string;
  description?: string;
  data: T[] | undefined;
  isLoading: boolean;
  columns: ColumnConfig[];
  onCreate: (item: Partial<T>) => void;
  onUpdate: (item: Partial<T> & { id: string }) => void;
  onDelete: (id: string) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function MasterDataTable<T extends { id: string; is_active: boolean }>({
  title,
  description,
  data,
  isLoading,
  columns,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: MasterDataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<T | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const filteredData = data?.filter((item) =>
    columns.some((col) => {
      const value = (item as any)[col.key];
      return value?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  const handleCreate = () => {
    onCreate(formData as Partial<T>);
    setFormData({});
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (editItem) {
      onUpdate({ ...formData, id: editItem.id } as Partial<T> & { id: string });
      setEditItem(null);
      setFormData({});
    }
  };

  const openEditDialog = (item: T) => {
    setEditItem(item);
    const initialData: Record<string, any> = {};
    columns.forEach((col) => {
      initialData[col.key] = (item as any)[col.key];
    });
    setFormData(initialData);
  };

  const renderFormField = (col: ColumnConfig) => {
    const value = formData[col.key] ?? "";

    switch (col.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={!!formData[col.key]}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, [col.key]: checked }))
              }
            />
            <Label>{formData[col.key] ? "Yes" : "No"}</Label>
          </div>
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [col.key]: e.target.value }))
            }
            placeholder={col.placeholder}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [col.key]: e.target.value ? Number(e.target.value) : null,
              }))
            }
            placeholder={col.placeholder}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [col.key]: e.target.value }))
            }
            placeholder={col.placeholder}
          />
        );
    }
  };

  const renderCellValue = (item: T, col: ColumnConfig) => {
    const value = (item as any)[col.key];

    if (col.type === "boolean") {
      return value ? (
        <Badge variant="default">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      );
    }

    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    return value.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setFormData({})}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New {title.replace(/s$/, "")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {columns.map((col) => (
                    <div key={col.key} className="space-y-2">
                      <Label>
                        {col.label}
                        {col.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      {renderFormField(col)}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={isCreating}>
                    {isCreating && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !filteredData?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No data found. Add your first item to get started.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key}>
                      <div className="flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {renderCellValue(item, col)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog
                          open={editItem?.id === item.id}
                          onOpenChange={(open) => !open && setEditItem(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Edit {title.replace(/s$/, "")}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              {columns.map((col) => (
                                <div key={col.key} className="space-y-2">
                                  <Label>
                                    {col.label}
                                    {col.required && (
                                      <span className="text-destructive ml-1">
                                        *
                                      </span>
                                    )}
                                  </Label>
                                  {renderFormField(col)}
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditItem(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                              >
                                {isUpdating && (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Save Changes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this item? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting && (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
