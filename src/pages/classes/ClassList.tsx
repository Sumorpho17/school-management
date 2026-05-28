import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/authStore';
import type { Tables } from '../../types/database';

type Class = Tables<'classes'>;
type Teacher = Tables<'teachers'>;

const emptyForm = {
  name: '',
  grade_level: '',
  section: '',
  academic_year: '',
  class_teacher_id: '',
  capacity: '' as string,
  room_number: '',
};

export default function ClassList() {
  const { schoolId } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    async function fetch() {
      const [classesRes, teachersRes] = await Promise.all([
        supabase.from('classes').select('*').eq('school_id', schoolId!).order('grade_level', { ascending: true }),
        supabase.from('teachers').select('id, first_name, last_name').eq('school_id', schoolId!).eq('status', 'active'),
      ]);
      if (classesRes.data) setClasses(classesRes.data);
      if (teachersRes.data) setTeachers(teachersRes.data as unknown as Teacher[]);
      setLoading(false);
    }
    fetch();
  }, [schoolId]);

  function openCreate() {
    setForm({
      ...emptyForm,
      academic_year: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    });
    setEditing(null);
    setError(null);
    setShowModal(true);
  }

  function openEdit(cls: Class) {
    setForm({
      name: cls.name,
      grade_level: cls.grade_level,
      section: cls.section ?? '',
      academic_year: cls.academic_year,
      class_teacher_id: cls.class_teacher_id ?? '',
      capacity: cls.capacity?.toString() ?? '',
      room_number: cls.room_number ?? '',
    });
    setEditing(cls);
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
      grade_level: form.grade_level,
      section: form.section || null,
      academic_year: form.academic_year,
      class_teacher_id: form.class_teacher_id || null,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      room_number: form.room_number || null,
    };

    if (editing) {
      const { error: err } = await supabase
        .from('classes')
        .update(payload)
        .eq('id', editing.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase
        .from('classes')
        .insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setShowModal(false);
    setSaving(false);
    if (schoolId) {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', schoolId)
        .order('grade_level', { ascending: true });
      if (data) setClasses(data);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this class? This cannot be undone.')) return;
    await supabase.from('classes').delete().eq('id', id);
    if (schoolId) {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', schoolId)
        .order('grade_level', { ascending: true });
      if (data) setClasses(data);
    }
  }

  const filtered = classes.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.grade_level.toLowerCase().includes(q) ||
      (c.section?.toLowerCase().includes(q))
    );
  });

  const teacherName = (id: string | null) => {
    if (!id) return '—';
    const t = teachers.find((t) => t.id === id);
    return t ? `${t.first_name} ${t.last_name}` : '—';
  };

  if (loading) return <div className="page-content"><div className="loading-screen"><div className="spinner-lg" /></div></div>;

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Classes</h2>
        <div className="page-actions">
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn-primary" onClick={openCreate}>+ Add Class</button>
        </div>
      </div>

      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>{search ? 'No classes match your search' : 'No classes yet'}</h3>
            <p>Create your first class to get started.</p>
            {!search && <button className="btn-primary" onClick={openCreate}>+ Add Class</button>}
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Academic Year</th>
                  <th>Class Teacher</th>
                  <th>Capacity</th>
                  <th>Room</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.grade_level}</td>
                    <td>{c.section || '—'}</td>
                    <td>{c.academic_year}</td>
                    <td>{teacherName(c.class_teacher_id)}</td>
                    <td>{c.capacity ?? '—'}</td>
                    <td>{c.room_number || '—'}</td>
                    <td className="actions-cell">
                      <button onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
            <h3>{editing ? 'Edit Class' : 'Add Class'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Class Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. JSS 1A" required />
                </div>
                <div className="form-group">
                  <label>Grade Level *</label>
                  <input value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })} placeholder="e.g. JSS 1" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Section</label>
                  <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="e.g. A, B, C" />
                </div>
                <div className="form-group">
                  <label>Academic Year *</label>
                  <input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="2025/2026" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Class Teacher</label>
                  <select value={form.class_teacher_id} onChange={(e) => setForm({ ...form, class_teacher_id: e.target.value })}>
                    <option value="">— None —</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="40" />
                </div>
              </div>
              <div className="form-group">
                <label>Room Number</label>
                <input value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} placeholder="e.g. Room 12" />
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
