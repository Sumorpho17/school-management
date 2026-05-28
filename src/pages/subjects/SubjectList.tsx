import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/authStore';
import type { Tables } from '../../types/database';

type Subject = Tables<'subjects'>;

const emptyForm = {
  name: '',
  code: '',
  description: '',
  credit_hours: '1' as string,
  is_elective: false,
};

export default function SubjectList() {
  const { schoolId } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    async function fetch() {
      const { data } = await supabase
        .from('subjects')
        .select('*')
        .eq('school_id', schoolId!)
        .order('name', { ascending: true });
      if (data) setSubjects(data);
      setLoading(false);
    }
    fetch();
  }, [schoolId]);

  function openCreate() {
    setForm(emptyForm);
    setEditing(null);
    setError(null);
    setShowModal(true);
  }

  function openEdit(subject: Subject) {
    setForm({
      name: subject.name,
      code: subject.code,
      description: subject.description ?? '',
      credit_hours: subject.credit_hours?.toString() ?? '1',
      is_elective: subject.is_elective,
    });
    setEditing(subject);
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!schoolId) return;
    setSaving(true);
    setError(null);

    const payload = {
      school_id: schoolId,
      name: form.name,
      code: form.code,
      description: form.description || null,
      credit_hours: parseInt(form.credit_hours) || 1,
      is_elective: form.is_elective,
    };

    if (editing) {
      const { error: err } = await supabase
        .from('subjects')
        .update(payload)
        .eq('id', editing.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase
        .from('subjects')
        .insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setShowModal(false);
    setSaving(false);
    if (schoolId) {
      const { data } = await supabase
        .from('subjects')
        .select('*')
        .eq('school_id', schoolId)
        .order('name', { ascending: true });
      if (data) setSubjects(data);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this subject? This cannot be undone.')) return;
    await supabase.from('subjects').delete().eq('id', id);
    if (schoolId) {
      const { data } = await supabase
        .from('subjects')
        .select('*')
        .eq('school_id', schoolId)
        .order('name', { ascending: true });
      if (data) setSubjects(data);
    }
  }

  const filtered = subjects.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="page-content"><div className="loading-screen"><div className="spinner-lg" /></div></div>;

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Subjects</h2>
        <div className="page-actions">
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn-primary" onClick={openCreate}>+ Add Subject</button>
        </div>
      </div>

      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h3>{search ? 'No subjects match your search' : 'No subjects yet'}</h3>
            <p>Add your first subject to get started.</p>
            {!search && <button className="btn-primary" onClick={openCreate}>+ Add Subject</button>}
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Credit Hours</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.code}</strong></td>
                    <td>{s.name}</td>
                    <td>{s.credit_hours ?? '—'}</td>
                    <td>{s.is_elective ? <span className="status-badge status-transferred">Elective</span> : <span className="status-badge status-completed">Core</span>}</td>
                    <td className="actions-cell">
                      <button onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? 'Edit Subject' : 'Add Subject'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Subject Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mathematics" required />
                </div>
                <div className="form-group">
                  <label>Subject Code *</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. MATH101" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Credit Hours</label>
                  <input type="number" value={form.credit_hours} onChange={(e) => setForm({ ...form, credit_hours: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={form.is_elective} onChange={(e) => setForm({ ...form, is_elective: e.target.checked })} />
                      Elective subject
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the subject"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
