import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { HandbookChunk } from '@/types/hr';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import {
  BookOpen, Plus, Pencil, Trash2, Search, Tag, FileText, Hash,
} from 'lucide-react';

const DEFAULT_TAGS = ['expenses', 'reimbursements', 'PTO', 'HRMS', 'payroll', 'remote_work', 'security', 'harassment', 'procurement'];

const emptyChunk: Omit<HandbookChunk, 'id'> = {
  source_title: 'Enfactum Employee Handbook 2025',
  section: '',
  page_hint: '',
  chunk_text: '',
  tags: [],
  last_updated: new Date().toISOString().split('T')[0],
};

const HandbookManager = () => {
  const { currentUser } = useAuth();
  const { handbook, setHandbook } = useData();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [editingChunk, setEditingChunk] = useState<HandbookChunk | null>(null);
  const [formData, setFormData] = useState<Omit<HandbookChunk, 'id'>>(emptyChunk);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!currentUser.is_hr_admin) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Handbook Manager</h1>
        <div className="glass-card p-8 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">You don't have permission to manage the handbook. Please switch to an HR Admin account.</p>
        </div>
      </div>
    );
  }

  const filtered = handbook.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.section.toLowerCase().includes(q) ||
      c.chunk_text.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q));
  });

  const openCreate = () => {
    setEditingChunk(null);
    setFormData({ ...emptyChunk, last_updated: new Date().toISOString().split('T')[0] });
    setTagInput('');
    setIsDialogOpen(true);
  };

  const openEdit = (chunk: HandbookChunk) => {
    setEditingChunk(chunk);
    setFormData({
      source_title: chunk.source_title,
      section: chunk.section,
      page_hint: chunk.page_hint,
      chunk_text: chunk.chunk_text,
      tags: [...chunk.tags],
      last_updated: chunk.last_updated,
    });
    setTagInput('');
    setIsDialogOpen(true);
  };

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && !formData.tags.includes(t)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSave = () => {
    if (!formData.section.trim() || !formData.chunk_text.trim()) {
      toast({ title: 'Missing fields', description: 'Section and content are required.', variant: 'destructive' });
      return;
    }

    if (editingChunk) {
      setHandbook(prev => prev.map(c =>
        c.id === editingChunk.id ? { ...c, ...formData, last_updated: new Date().toISOString().split('T')[0] } : c
      ));
      toast({ title: 'Chunk updated', description: `"${formData.section}" has been updated.` });
    } else {
      const newChunk: HandbookChunk = {
        id: `hb-${Date.now()}`,
        ...formData,
      };
      setHandbook(prev => [...prev, newChunk]);
      toast({ title: 'Chunk created', description: `"${formData.section}" has been added.` });
    }

    setIsDialogOpen(false);
    setEditingChunk(null);
  };

  const handleDelete = (id: string) => {
    setHandbook(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    toast({ title: 'Chunk deleted', description: 'The handbook chunk has been removed.' });
  };

  const allTags = [...new Set(handbook.flatMap(c => c.tags))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Handbook Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">{handbook.length} chunks · Manage employee handbook knowledge base</p>
        </div>
        <button className="btn-primary text-sm" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Chunk
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
              <FileText className="w-3.5 h-3.5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Total Chunks</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{handbook.length}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--positive-muted))' }}>
              <Hash className="w-3.5 h-3.5" style={{ color: 'hsl(var(--positive))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Sections</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{new Set(handbook.map(c => c.section)).size}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--warning-muted))' }}>
              <Tag className="w-3.5 h-3.5" style={{ color: 'hsl(var(--warning))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Unique Tags</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{allTags.length}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--info-muted))' }}>
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'hsl(var(--info))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Source</span>
          </div>
          <p className="text-sm font-medium text-foreground mt-1">Handbook 2025</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search sections, content, or tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Chunks list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            No chunks found. {search ? 'Try a different search.' : 'Add your first handbook chunk.'}
          </div>
        ) : (
          filtered.map(chunk => (
            <div key={chunk.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-foreground">{chunk.section}</span>
                    <span className="text-xs mono text-muted-foreground">{chunk.page_hint}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{chunk.chunk_text}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {chunk.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">Updated {chunk.last_updated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[hsl(var(--surface-3))]"
                    onClick={() => openEdit(chunk)}
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  {deleteConfirm === chunk.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg px-2 py-1 text-[10px] font-medium"
                        style={{ background: 'hsl(var(--negative-muted))', color: 'hsl(var(--negative))' }}
                        onClick={() => handleDelete(chunk.id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="rounded-lg px-2 py-1 text-[10px] font-medium text-muted-foreground"
                        style={{ background: 'hsl(var(--surface-3))' }}
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[hsl(var(--negative-muted))]"
                      onClick={() => setDeleteConfirm(chunk.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingChunk ? 'Edit Chunk' : 'Add Handbook Chunk'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Section Title *</Label>
              <Input
                value={formData.section}
                onChange={e => setFormData(prev => ({ ...prev, section: e.target.value }))}
                placeholder="e.g. Expense & Reimbursement Policy"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Page Hint</Label>
                <Input
                  value={formData.page_hint}
                  onChange={e => setFormData(prev => ({ ...prev, page_hint: e.target.value }))}
                  placeholder="e.g. p. 12"
                />
              </div>
              <div>
                <Label>Source Title</Label>
                <Input
                  value={formData.source_title}
                  onChange={e => setFormData(prev => ({ ...prev, source_title: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Content *</Label>
              <Textarea
                value={formData.chunk_text}
                onChange={e => setFormData(prev => ({ ...prev, chunk_text: e.target.value }))}
                placeholder="Paste or type the handbook section content..."
                rows={5}
              />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer flex items-center gap-1"
                    style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => addTag(tagInput)}>Add</Button>
              </div>
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="text-[10px] text-muted-foreground mr-1">Quick:</span>
                {DEFAULT_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 6).map(tag => (
                  <button
                    key={tag}
                    className="rounded-full px-1.5 py-0.5 text-[10px] border transition-colors"
                    style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingChunk ? 'Save Changes' : 'Add Chunk'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HandbookManager;
