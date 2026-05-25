import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SchoolDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    logoFile: File | null;
}

interface TermData {
    name: string;
    startDate: string;
    endDate: string;
}

interface AcademicCalendar {
    academicYear: string;
    terms: [TermData, TermData, TermData];
    currentTermIndex: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SchoolSetup() {
    const navigate = useNavigate();
    const { user, getProfile } = useAuth();

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Step 1 — School Details
    const [school, setSchool] = useState<SchoolDetails>({
        name: '',
        address: '',
        phone: '',
        email: '',
        logoFile: null,
    });

    // Step 2 — Academic Calendar
    const [calendar, setCalendar] = useState<AcademicCalendar>({
        academicYear: '2024/2025',
        terms: [
            { name: 'First Term', startDate: '', endDate: '' },
            { name: 'Second Term', startDate: '', endDate: '' },
            { name: 'Third Term', startDate: '', endDate: '' },
        ],
        currentTermIndex: 0,
    });

    /* ---- helpers ---- */

    const updateSchool = (field: keyof SchoolDetails, value: string) => {
        setSchool((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoChange = (file: File | null) => {
        setSchool((prev) => ({ ...prev, logoFile: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(null);
        }
    };

    const updateTerm = (
        index: number,
        field: keyof TermData,
        value: string,
    ) => {
        setCalendar((prev) => {
            const terms = [...prev.terms] as [TermData, TermData, TermData];
            terms[index] = { ...terms[index], [field]: value };
            return { ...prev, terms };
        });
    };

    /* ---- validation ---- */

    const validateStep1 = (): boolean => {
        if (!school.name.trim()) {
            setError('School name is required.');
            return false;
        }
        setError(null);
        return true;
    };

    const validateStep2 = (): boolean => {
        for (let i = 0; i < 3; i++) {
            const t = calendar.terms[i];
            if (!t.name.trim() || !t.startDate || !t.endDate) {
                setError(`Please fill in all fields for ${t.name || `Term ${i + 1}`}.`);
                return false;
            }
            if (new Date(t.startDate) >= new Date(t.endDate)) {
                setError(`${t.name}: start date must be before end date.`);
                return false;
            }
        }
        setError(null);
        return true;
    };

    /* ---- navigation ---- */

    const next = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep((s) => Math.min(s + 1, 3));
    };

    const back = () => setStep((s) => Math.max(s - 1, 1));

    /* ---- submit ---- */

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        setError(null);

        try {
            // 1. Upload logo if provided
            let logoUrl: string | null = null;
            if (school.logoFile) {
                const ext = school.logoFile.name.split('.').pop();
                const path = `logos/${user.id}-${Date.now()}.${ext}`;

                const { error: uploadErr } = await supabase.storage
                    .from('school-assets')
                    .upload(path, school.logoFile, { upsert: true });

                if (uploadErr) throw new Error(`Logo upload failed: ${uploadErr.message}`);

                const { data: urlData } = supabase.storage
                    .from('school-assets')
                    .getPublicUrl(path);

                logoUrl = urlData.publicUrl;
            }

            // 2. Insert school
            const { data: newSchool, error: schoolErr } = await supabase
                .from('schools')
                .insert({
                    name: school.name.trim(),
                    address: school.address.trim() || null,
                    phone: school.phone.trim() || null,
                    email: school.email.trim() || null,
                    logo_url: logoUrl,
                })
                .select('id')
                .single();

            if (schoolErr || !newSchool) {
                throw new Error(schoolErr?.message ?? 'Failed to create school.');
            }

            const schoolId = newSchool.id;

            // 3. Insert academic terms
            const termRows = calendar.terms.map((t, i) => ({
                school_id: schoolId,
                name: `${t.name} — ${calendar.academicYear}`,
                start_date: t.startDate,
                end_date: t.endDate,
                is_current: i === calendar.currentTermIndex,
            }));

            const { error: termsErr } = await supabase
                .from('academic_terms')
                .insert(termRows);

            if (termsErr) throw new Error(`Failed to save terms: ${termsErr.message}`);

            // 4. Link admin profile → school
            const { error: profileErr } = await supabase
                .from('profiles')
                .update({ school_id: schoolId })
                .eq('id', user.id);

            if (profileErr) throw new Error(`Failed to update profile: ${profileErr.message}`);

            // 5. Refresh auth profile then redirect
            await getProfile();
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------------------------------------------------------- */
    /*  Render helpers                                                    */
    /* ---------------------------------------------------------------- */

    const stepLabels = ['School Details', 'Academic Calendar', 'Review & Launch'];

    const renderProgressBar = () => (
        <div className="onboarding-progress">
            {stepLabels.map((label, i) => (
                <div
                    key={label}
                    className={`progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
                >
                    <div className="step-circle">
                        {i + 1 < step ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            i + 1
                        )}
                    </div>
                    <span className="step-label">{label}</span>
                </div>
            ))}
        </div>
    );

    /* --- Step 1 --- */
    const renderStep1 = () => (
        <div className="onboarding-step">
            <h2>🏫 School Details</h2>
            <p className="step-description">Tell us about your school.</p>

            <div className="form-group">
                <label htmlFor="school-name">School Name *</label>
                <input
                    id="school-name"
                    type="text"
                    value={school.name}
                    onChange={(e) => updateSchool('name', e.target.value)}
                    placeholder="e.g. Greenfield Academy"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="school-address">Address</label>
                <input
                    id="school-address"
                    type="text"
                    value={school.address}
                    onChange={(e) => updateSchool('address', e.target.value)}
                    placeholder="e.g. 12 Unity Road, Ikeja, Lagos"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="school-phone">Phone</label>
                    <input
                        id="school-phone"
                        type="tel"
                        value={school.phone}
                        onChange={(e) => updateSchool('phone', e.target.value)}
                        placeholder="+234 800 000 0000"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="school-email">Email</label>
                    <input
                        id="school-email"
                        type="email"
                        value={school.email}
                        onChange={(e) => updateSchool('email', e.target.value)}
                        placeholder="info@school.edu"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="school-logo">School Logo (optional)</label>
                <div className="logo-upload-area">
                    {logoPreview ? (
                        <div className="logo-preview">
                            <img src={logoPreview} alt="Logo preview" />
                            <button
                                type="button"
                                className="btn-remove-logo"
                                onClick={() => handleLogoChange(null)}
                            >✕</button>
                        </div>
                    ) : (
                        <label htmlFor="school-logo" className="logo-dropzone">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Click to upload logo</span>
                        </label>
                    )}
                    <input
                        id="school-logo"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
                    />
                </div>
            </div>
        </div>
    );

    /* --- Step 2 --- */
    const renderStep2 = () => (
        <div className="onboarding-step">
            <h2>📅 Academic Calendar</h2>
            <p className="step-description">Set up your academic year and term dates.</p>

            <div className="form-group">
                <label htmlFor="academic-year">Academic Year</label>
                <input
                    id="academic-year"
                    type="text"
                    value={calendar.academicYear}
                    onChange={(e) =>
                        setCalendar((prev) => ({ ...prev, academicYear: e.target.value }))
                    }
                    placeholder="2024/2025"
                />
            </div>

            {calendar.terms.map((term, idx) => (
                <div key={idx} className="term-card">
                    <div className="term-header">
                        <h3>Term {idx + 1}</h3>
                        <label className="current-term-toggle">
                            <input
                                type="radio"
                                name="currentTerm"
                                checked={calendar.currentTermIndex === idx}
                                onChange={() =>
                                    setCalendar((prev) => ({ ...prev, currentTermIndex: idx }))
                                }
                            />
                            <span>Current Term</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor={`term-name-${idx}`}>Term Name</label>
                        <input
                            id={`term-name-${idx}`}
                            type="text"
                            value={term.name}
                            onChange={(e) => updateTerm(idx, 'name', e.target.value)}
                            placeholder={`e.g. First Term`}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor={`term-start-${idx}`}>Start Date</label>
                            <input
                                id={`term-start-${idx}`}
                                type="date"
                                value={term.startDate}
                                onChange={(e) => updateTerm(idx, 'startDate', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor={`term-end-${idx}`}>End Date</label>
                            <input
                                id={`term-end-${idx}`}
                                type="date"
                                value={term.endDate}
                                onChange={(e) => updateTerm(idx, 'endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    /* --- Step 3 --- */
    const renderStep3 = () => (
        <div className="onboarding-step">
            <h2>🚀 Review &amp; Launch</h2>
            <p className="step-description">
                Make sure everything looks good before launching your school.
            </p>

            <div className="review-section">
                <h3>School Details</h3>
                <div className="review-grid">
                    <div className="review-item">
                        <span className="review-label">Name</span>
                        <span className="review-value">{school.name}</span>
                    </div>
                    {school.address && (
                        <div className="review-item">
                            <span className="review-label">Address</span>
                            <span className="review-value">{school.address}</span>
                        </div>
                    )}
                    {school.phone && (
                        <div className="review-item">
                            <span className="review-label">Phone</span>
                            <span className="review-value">{school.phone}</span>
                        </div>
                    )}
                    {school.email && (
                        <div className="review-item">
                            <span className="review-label">Email</span>
                            <span className="review-value">{school.email}</span>
                        </div>
                    )}
                    {logoPreview && (
                        <div className="review-item">
                            <span className="review-label">Logo</span>
                            <img src={logoPreview} alt="Logo" className="review-logo" />
                        </div>
                    )}
                </div>
            </div>

            <div className="review-section">
                <h3>Academic Calendar — {calendar.academicYear}</h3>
                <div className="review-terms">
                    {calendar.terms.map((t, i) => (
                        <div
                            key={i}
                            className={`review-term-card ${i === calendar.currentTermIndex ? 'current' : ''}`}
                        >
                            <div className="review-term-name">
                                {t.name}
                                {i === calendar.currentTermIndex && (
                                    <span className="badge-current">Active</span>
                                )}
                            </div>
                            <div className="review-term-dates">
                                {formatDate(t.startDate)} — {formatDate(t.endDate)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ---------------------------------------------------------------- */
    /*  Main render                                                      */
    /* ---------------------------------------------------------------- */

    return (
        <div className="onboarding-container">
            <div className="onboarding-card">
                <div className="onboarding-header">
                    <div className="onboarding-logo">
                        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="10" fill="url(#grad-ob)" />
                            <path d="M12 28V16L20 10L28 16V28H22V22H18V28H12Z" fill="white" />
                            <defs>
                                <linearGradient id="grad-ob" x1="0" y1="0" x2="40" y2="40">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>SchoolHub Setup</span>
                    </div>
                    {renderProgressBar()}
                </div>

                {error && (
                    <div className="alert alert-error">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    <div className="onboarding-actions">
                        {step > 1 && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={back}
                                disabled={submitting}
                            >
                                ← Back
                            </button>
                        )}
                        <div className="actions-spacer" />
                        {step < 3 ? (
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={next}
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn-launch"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <><span className="spinner" /> Setting up…</>
                                ) : (
                                    '🚀 Launch My School'
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
