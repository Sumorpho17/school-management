import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/authStore';
import type { Tables } from '../../types/database';

type Teacher = Tables<'teachers'>;

const emptyForm: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_id: string;
  gender: 'male' | 'female' | 'other';
  subject_specialization: string;
  qualification: string;
  status: Teacher['status'];
} = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  employee_id: '',
  gender: 'male',
  subject_specialization: '',
  qualification: '',
  status: 'active',
};

export default function TeacherList() {
  const { schoolId } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    async function fetch() {
      const { data } = await supabase
        .from('teachers')
        .select('*')
        .eq('school_id', schoolId!)
        .order('created_at', { ascending: false });
      if (data) setTeachers(data);
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

  function openEdit(teacher: Teacher) {
    setForm({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      phone: teacher.phone ?? '',
      employee_id: teacher.employee_id,
      gender: teacher.gender,
      subject_specialization: teacher.subject_specialization ?? '',
      qualification: teacher.qualification ?? '',
      status: teacher.status,
    });
    setEditing(teacher);
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!schoolId) return;
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      school_id: schoolId,
      phone: form.phone || null,
      subject_specialization: form.subject_specialization || null,
      qualification: form.qualification || null,
    };

    if (editing) {
      const { error: err } = await supabase
        .from('teachers')
        .update(payload)
        .eq('id', editing.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase
        .from('teachers')
        .insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setShowModal(false);
    setSaving(false);
    if (schoolId) {
      const { data } = await supabase
        .from('teachers')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      if (data) setTeachers(data);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this teacher? This cannot be undone.')) return;
    await supabase.from('teachers').delete().eq('id', id);
    if (schoolId) {
      const { data } = await supabase
        .from('teachers')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      if (data) setTeachers(data);
    }
  }

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.first_name.toLowerCase().includes(q) ||
      t.last_name.toLowerCase().includes(q) ||
      t.employee_id.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="page-content"><div className="loading-screen"><div className="spinner-lg" /></div></div>;

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Teachers</h2>
        <div className="page-actions">
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn-primary" onClick={openCreate}>+ Add Teacher</button>
        </div>
      </div>

      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👩‍🏫</div>
            <h3>{search ? 'No teachers match your search' : 'No teachers yet'}</h3>
            <p>Add your first teacher to get started.</p>
            {!search && <button className="btn-primary" onClick={openCreate}>+ Add Teacher</button>}
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee #</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.employee_id}</strong></td>
                    <td>{t.first_name} {t.last_name}</td>
                    <td>{t.email}</td>
                    <td>{t.subject_specialization || '—'}</td>
                    <td><span className={`status-badge status-${t.status}`}>{t.status}</span></td>
                    <td className="actions-cell">
                      <button onClick={() => openEdit(t)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
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
            <h3>{editing ? 'Edit Teacher' : 'Add Teacher'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'male' | 'female' | 'other' })}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Teacher['status'] })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Subject Specialization</label>
                <input value={form.subject_specialization} onChange={(e) => setForm({ ...form, subject_specialization: e.target.value })} placeholder="e.g. Mathematics, Physics" />
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="e.g. B.Ed, M.Sc" />
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
