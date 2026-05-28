import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../store/authStore';
import type { Tables } from '../../types/database';

type Student = Tables<'students'>;

const emptyForm: {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  admission_number: string;
  status: Student['status'];
} = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: 'male',
  email: '',
  phone: '',
  address: '',
  admission_number: '',
  status: 'active',
};

export default function StudentList() {
  const { schoolId } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    async function fetch() {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId!)
        .order('created_at', { ascending: false });
      if (data) setStudents(data);
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

  function openEdit(student: Student) {
    setForm({
      first_name: student.first_name,
      last_name: student.last_name,
      date_of_birth: student.date_of_birth.slice(0, 10),
      gender: student.gender,
      email: student.email ?? '',
      phone: student.phone ?? '',
      address: student.address ?? '',
      admission_number: student.admission_number,
      status: student.status,
    });
    setEditing(student);
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
      email: form.email || null,
      phone: form.phone || null,
      address: form.address || null,
    };

    if (editing) {
      const { error: err } = await supabase
        .from('students')
        .update(payload)
        .eq('id', editing.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase
        .from('students')
        .insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }

    setShowModal(false);
    setSaving(false);
    if (schoolId) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      if (data) setStudents(data);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this student? This cannot be undone.')) return;
    await supabase.from('students').delete().eq('id', id);
    if (schoolId) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      if (data) setStudents(data);
    }
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.admission_number.toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="page-content"><div className="loading-screen"><div className="spinner-lg" /></div></div>;

  return (
    <div className="dashboard-main">
      <div className="page-header">
        <h2>Students</h2>
        <div className="page-actions">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn-primary" onClick={openCreate}>+ Add Student</button>
        </div>
      </div>

      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍🎓</div>
            <h3>{search ? 'No students match your search' : 'No students yet'}</h3>
            <p>Add your first student to get started.</p>
            {!search && <button className="btn-primary" onClick={openCreate}>+ Add Student</button>}
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Admission #</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.admission_number}</strong></td>
                    <td>{s.first_name} {s.last_name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.gender}</td>
                    <td>{s.date_of_birth}</td>
                    <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
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
            <h3>{editing ? 'Edit Student' : 'Add Student'}</h3>
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
                  <label>Admission Number *</label>
                  <input value={form.admission_number} onChange={(e) => setForm({ ...form, admission_number: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
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
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Student['status'] })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
