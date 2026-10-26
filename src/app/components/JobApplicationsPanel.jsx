'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const STATUS_STYLES = {
  New: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  Shortlisted: 'bg-purple-100 text-purple-700',
  'Interview Scheduled': 'bg-indigo-100 text-indigo-700',
  Selected: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Withdrawn: 'bg-zinc-200 text-zinc-600',
};

const EDIT_FIELDS = [
  { name: 'name', label: 'Full Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', required: true },
  { name: 'alternative_phone', label: 'Alternative Phone' },
  { name: 'experience', label: 'Experience', required: true },
  { name: 'current_company', label: 'Current Company' },
  { name: 'notice_period', label: 'Notice Period' },
  { name: 'current_salary', label: 'Current Salary' },
  { name: 'expected_salary', label: 'Expected Salary' },
];

function formatDate(value, withTime = false) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' });
}

export default function JobApplicationsPanel() {
  const [applications, setApplications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editResume, setEditResume] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const loadApplications = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please sign in to track your applications.');
      const response = await fetch('/api/career-enquiries', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Applications could not be loaded');
      setApplications(data.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
    const interval = setInterval(() => loadApplications(true), 30000);
    return () => clearInterval(interval);
  }, [loadApplications]);

  const startEdit = (application) => {
    setEditingId(application.id);
    setEditResume(null);
    setEditForm({
      name: application.name || '',
      email: application.email || '',
      phone: application.phone || '',
      alternative_phone: application.alternative_phone || '',
      experience: application.experience || '',
      current_company: application.current_company || '',
      notice_period: application.notice_period || '',
      current_salary: application.current_salary || '',
      expected_salary: application.expected_salary || '',
      cover_letter: application.cover_letter || '',
    });
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    setEditSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please sign in to edit your application.');
      const formData = new FormData();
      formData.append('id', editingId);
      Object.entries(editForm).forEach(([key, value]) => formData.append(key, value || ''));
      if (editResume) formData.append('resume', editResume);

      const response = await fetch('/api/career-enquiries', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Application could not be updated');
      setApplications((current) => current.map((item) => item.id === data.data.id ? data.data : item));
      setEditingId(null);
      setEditResume(null);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) {
    return <div className="border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">Loading applications…</div>;
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-blue-600">Career Tracking</p>
          <h2 className="mt-1 text-2xl font-black uppercase text-zinc-900">My Job Applications</h2>
          <p className="mt-1 text-sm text-zinc-500">Click an application to view its details and complete status timeline.</p>
        </div>
        <button type="button" onClick={() => loadApplications()} className="border border-zinc-300 px-4 py-2 text-xs font-black uppercase text-zinc-700">
          Refresh
        </button>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {applications.length === 0 ? (
        <div className="border border-zinc-200 bg-white p-12 text-center">
          <div className="text-4xl">💼</div>
          <p className="mt-3 font-black text-zinc-900">No job applications yet</p>
          <Link href="/careers" className="mt-4 inline-block bg-blue-600 px-5 py-2.5 text-xs font-black uppercase text-white">
            View Open Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => {
            const isExpanded = expanded === application.id;
            return (
              <article
                key={application.id}
                className="cursor-pointer overflow-hidden border border-zinc-200 bg-white shadow-sm transition hover:border-blue-400"
                onClick={() => setExpanded(isExpanded ? null : application.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setExpanded(isExpanded ? null : application.id);
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        {application.application_reference || `Application #${application.id}`}
                      </p>
                      <h3 className="mt-1 text-lg font-black text-zinc-900">{application.position}</h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {[application.department, application.job_location].filter(Boolean).join(' · ') || 'MTBOSS'}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${STATUS_STYLES[application.status] || 'bg-zinc-100 text-zinc-700'}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-zinc-500">
                    <span><strong className="text-zinc-800">Applied:</strong> {formatDate(application.created_at)}</span>
                    <span><strong className="text-zinc-800">Experience:</strong> {application.experience}</span>
                    {application.interview_at && <span><strong className="text-zinc-800">Interview:</strong> {formatDate(application.interview_at, true)}</span>}
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-blue-600">
                    {isExpanded ? 'Hide application details' : 'View status and details →'}
                  </p>
                </div>

                {isExpanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50 p-5" onClick={(event) => event.stopPropagation()}>
                    <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Applicant</span>{application.name}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Email</span>{application.email}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Phone</span>{application.phone}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Current Company</span>{application.current_company || '—'}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Notice Period</span>{application.notice_period || '—'}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Resume</span>{application.resume_name || '—'}</div>
                    </div>

                    <div className="mt-5">
                      {editingId === application.id ? (
                        <form onSubmit={saveEdit} className="border border-zinc-200 bg-white p-4">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {EDIT_FIELDS.map((field) => (
                              <label key={field.name} className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                {field.label}
                                <input
                                  type={field.type || 'text'}
                                  required={field.required}
                                  value={editForm[field.name] || ''}
                                  onChange={(event) => setEditForm((current) => ({ ...current, [field.name]: event.target.value }))}
                                  className="mt-1 w-full border border-zinc-200 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-zinc-900 outline-none focus:border-blue-500"
                                />
                              </label>
                            ))}
                          </div>
                          <label className="mt-3 block text-[10px] font-black uppercase tracking-wider text-zinc-500">
                            Cover Letter
                            <textarea
                              value={editForm.cover_letter || ''}
                              onChange={(event) => setEditForm((current) => ({ ...current, cover_letter: event.target.value }))}
                              rows={4}
                              className="mt-1 w-full border border-zinc-200 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-zinc-900 outline-none focus:border-blue-500"
                            />
                          </label>
                          <label className="mt-3 block text-[10px] font-black uppercase tracking-wider text-zinc-500">
                            Replace Resume
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={(event) => setEditResume(event.target.files?.[0] || null)}
                              className="mt-1 w-full border border-zinc-200 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-zinc-900"
                            />
                          </label>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="submit" disabled={editSaving} className="bg-blue-600 px-4 py-2 text-xs font-black uppercase text-white disabled:opacity-60">
                              {editSaving ? 'Saving...' : 'Save Application'}
                            </button>
                            <button type="button" onClick={() => setEditingId(null)} className="border border-zinc-300 px-4 py-2 text-xs font-black uppercase text-zinc-700">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button type="button" onClick={() => startEdit(application)} className="border border-blue-600 px-4 py-2 text-xs font-black uppercase text-blue-600">
                          Edit Application
                        </button>
                      )}
                    </div>

                    {application.status_note && (
                      <div className="mt-5 border-l-4 border-blue-600 bg-blue-50 p-4">
                        <p className="text-[9px] font-black uppercase text-blue-700">Latest HR Update</p>
                        <p className="mt-1 text-sm text-zinc-700">{application.status_note}</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <p className="mb-4 text-xs font-black uppercase tracking-wider text-zinc-800">Application Timeline</p>
                      {(application.history || []).map((event, index) => (
                        <div key={event.id || `${event.status}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
                          {index < application.history.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-300" />}
                          <span className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-blue-100 bg-blue-600" />
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{event.title}</p>
                            {event.note && <p className="mt-0.5 text-sm text-zinc-600">{event.note}</p>}
                            <p className="mt-0.5 text-[11px] text-zinc-400">
                              {formatDate(event.created_at, true)}{event.actor_name ? ` · ${event.actor_name}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
