'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  Pencil,
  X,
  User,
  RefreshCw,
  Eye,
  ChevronDown,
} from '@/app/components/ui/icons';

const TYPE_CONFIG = {
  daily: {
    label: 'Per Day Task',
    badgeText: 'Daily (24h)',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    icon: '⚡',
  },
  weekly: {
    label: 'One Week Task',
    badgeText: 'Weekly (7 Days)',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.3)',
    icon: '📅',
  },
  monthly: {
    label: 'One Month Task',
    badgeText: 'Monthly (30 Days)',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.3)',
    icon: '🗓️',
  },
  custom: {
    label: 'Custom Deadline',
    badgeText: 'Custom Limit',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.3)',
    icon: '⏱️',
  },
};

const PRIORITY_COLORS = {
  Low: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
  Medium: { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' },
  High: { color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)' },
  Urgent: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' },
};

const STATUS_COLORS = {
  Pending: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', icon: Clock },
  'In Progress': { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', icon: RefreshCw },
  Completed: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: CheckCircle2 },
  Overdue: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: AlertCircle },
  Cancelled: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', icon: X },
};

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return 'No due date';
  const due = new Date(dueDateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const dateFormatted = due.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatted = due.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: `${dateFormatted} (${overdueDays === 0 ? 'Today' : `${overdueDays}d ago`})`,
      tag: overdueDays === 0 ? 'Overdue today' : `Overdue by ${overdueDays}d`,
      isOverdue: true,
      time: timeFormatted,
    };
  }

  if (diffHours <= 24) {
    return {
      text: `${dateFormatted} at ${timeFormatted}`,
      tag: diffHours <= 1 ? 'Due in < 1h' : `Due in ${diffHours}h`,
      isDueSoon: true,
      time: timeFormatted,
    };
  }

  return {
    text: `${dateFormatted} at ${timeFormatted}`,
    tag: `${diffDays} days left`,
    isUpcoming: true,
    time: timeFormatted,
  };
}

function AgentCheckboxDropdown({
  agents = [],
  selectedIds = [],
  onChange,
  placeholder = 'Select Agent(s)...',
  isFilter = false,
  minWidth = '220px',
  width = 'auto',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredAgents = useMemo(() => {
    if (!search.trim()) return agents;
    const q = search.toLowerCase();
    return agents.filter(
      (ag) =>
        (ag.name && ag.name.toLowerCase().includes(q)) ||
        (ag.city && ag.city.toLowerCase().includes(q)) ||
        (ag.phone && ag.phone.includes(q))
    );
  }, [agents, search]);

  const allSelected = agents.length > 0 && selectedIds.length === agents.length;
  const isNoneSelected = selectedIds.length === 0;

  let buttonLabel = '';
  if (isFilter) {
    if (isNoneSelected || allSelected) {
      buttonLabel = `All Agents (${agents.length})`;
    } else if (selectedIds.length === 1) {
      const ag = agents.find((a) => a.id === selectedIds[0]);
      buttonLabel = ag ? `${ag.name}${ag.city ? ` (${ag.city})` : ''}` : '1 Agent Selected';
    } else {
      const firstAg = agents.find((a) => a.id === selectedIds[0]);
      buttonLabel = firstAg
        ? `${firstAg.name} + ${selectedIds.length - 1} more (${selectedIds.length})`
        : `${selectedIds.length} Agents Selected`;
    }
  } else {
    if (allSelected) {
      buttonLabel = `All Agents (${agents.length} selected)`;
    } else if (isNoneSelected) {
      buttonLabel = placeholder;
    } else if (selectedIds.length === 1) {
      const ag = agents.find((a) => a.id === selectedIds[0]);
      buttonLabel = ag ? `${ag.name}${ag.city ? ` (${ag.city})` : ''}` : '1 Agent Selected';
    } else {
      const firstAg = agents.find((a) => a.id === selectedIds[0]);
      buttonLabel = firstAg
        ? `${firstAg.name} + ${selectedIds.length - 1} more (${selectedIds.length} selected)`
        : `${selectedIds.length} Agents Selected`;
    }
  }

  const handleToggleAgent = (agentId) => {
    const isChecked = selectedIds.includes(agentId);
    let next;
    if (isChecked) {
      next = selectedIds.filter((id) => id !== agentId);
    } else {
      next = [...selectedIds, agentId];
    }
    onChange(next);
  };

  const handleSelectAll = () => {
    onChange(agents.map((a) => a.id));
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width, minWidth }}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
          padding: '0.45rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          background: 'var(--bg)',
          color: isNoneSelected && !isFilter ? 'var(--muted)' : 'var(--text)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          boxSizing: 'border-box',
          minHeight: '35px',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {buttonLabel}
        </span>
        <ChevronDown
          size={15}
          style={{
            flexShrink: 0,
            color: 'var(--muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: width === '100%' ? 0 : 'auto',
            minWidth: width === '100%' ? '100%' : '270px',
            maxWidth: '360px',
            background: 'var(--surface, #1e293b)',
            border: '1px solid var(--border, #334155)',
            borderRadius: '8px',
            boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.45)',
            zIndex: 99999,
            padding: '0.6rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Quick Search */}
          <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search agent name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.35rem 0.55rem 0.35rem 1.7rem',
                borderRadius: '5px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.78rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Quick Actions Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.2rem 0.2rem 0.45rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '0.4rem',
              fontSize: '0.74rem',
            }}
          >
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>
              {selectedIds.length === 0 && isFilter
                ? `All ${agents.length} active`
                : `${selectedIds.length} of ${agents.length} selected`}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleSelectAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Select All
              </button>
              <span style={{ color: 'var(--border)' }}>|</span>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* All Agents checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.35rem 0.45rem',
              borderRadius: '5px',
              cursor: 'pointer',
              background: allSelected ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
              marginBottom: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: allSelected ? '#0284c7' : 'var(--text)',
            }}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => (allSelected ? handleClear() : handleSelectAll())}
              style={{ cursor: 'pointer' }}
            />
            <span>All Agents ({agents.length})</span>
          </label>

          {/* Checkbox list */}
          <div
            style={{
              maxHeight: '190px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              paddingRight: '2px',
            }}
          >
            {filteredAgents.length === 0 ? (
              <div style={{ padding: '0.6rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.78rem' }}>
                No agents match search
              </div>
            ) : (
              filteredAgents.map((ag) => {
                const checked = selectedIds.includes(ag.id);
                return (
                  <label
                    key={ag.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.35rem 0.45rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      background: checked ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                      border: checked ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleAgent(ag.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: checked ? 700 : 500,
                          color: 'var(--text)',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {ag.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--muted)',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {ag.city || 'No City'} {ag.phone ? `· ${ag.phone}` : ''}
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentTasksManager({ isDarkMode = false }) {
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [agentsLoading, setAgentsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterAgentIds, setFilterAgentIds] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewDetailTask, setViewDetailTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Create Form state
  const [form, setForm] = useState({
    agent_ids: [],
    assign_to_all: false,
    title: '',
    description: '',
    task_type: 'daily',
    priority: 'Medium',
    due_date: '',
  });

  // Edit Form state
  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    description: '',
    task_type: 'daily',
    priority: 'Medium',
    status: 'Pending',
    due_date: '',
    agent_remark: '',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const params = new URLSearchParams();
      if (filterAgentIds && filterAgentIds.length > 0 && filterAgentIds.length < agents.length) {
        params.set('agent_ids', filterAgentIds.join(','));
      }
      if (filterType && filterType !== 'all') params.set('task_type', filterType);
      if (filterStatus && filterStatus !== 'all') params.set('status', filterStatus);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/agent-tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
        setStats(data.stats || {});
      } else {
        showToast(data.error || 'Failed to load tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [filterAgentIds, filterType, filterStatus, search, agents.length]);

  const fetchAgents = useCallback(async () => {
    try {
      setAgentsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch('/api/agents?limit=150&status=Approved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAgents(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.assign_to_all && (!form.agent_ids || form.agent_ids.length === 0)) {
      alert('Please select at least one agent (or choose "Assign to all approved agents")');
      return;
    }
    if (!form.title.trim()) {
      alert('Task title is required');
      return;
    }

    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch('/api/admin/agent-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Task assigned successfully!');
        setShowCreateModal(false);
        setForm({
          agent_ids: [],
          assign_to_all: false,
          title: '',
          description: '',
          task_type: 'daily',
          priority: 'Medium',
          due_date: '',
        });
        fetchTasks();
      } else {
        alert(data.error || 'Could not assign task');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while assigning task');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (task) => {
    setEditForm({
      id: task.id,
      title: task.title,
      description: task.description || '',
      task_type: task.task_type || 'daily',
      priority: task.priority || 'Medium',
      status: task.status || 'Pending',
      due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      agent_remark: task.agent_remark || '',
    });
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch('/api/admin/agent-tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Task updated successfully!');
        setShowEditModal(false);
        fetchTasks();
      } else {
        alert(data.error || 'Failed to update task');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating task');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete task: "${title}"?`)) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch(`/api/admin/agent-tasks?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Task deleted successfully');
        fetchTasks();
      } else {
        alert(data.error || 'Failed to delete task');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const handleQuickStatusChange = async (task, newStatus) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const res = await fetch('/api/admin/agent-tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Task status updated to ${newStatus}`);
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6" style={{ minHeight: '80vh' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#10b981',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarClock size={28} className="text-[#0284c7]" />
            Agent Task Management
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
            Assign, schedule and track daily, weekly, and monthly tasks assigned to agents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            background: 'var(--brand-blue, #0284c7)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
          }}
        >
          <Plus size={18} /> Assign New Task
        </button>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.05em' }}>
            Total Tasks
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', color: 'var(--text)' }}>
            {stats.total_tasks || 0}
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>
            ⚡ Per Day (Daily)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', color: '#f59e0b' }}>
            {stats.daily_tasks || 0}
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#3b82f6', letterSpacing: '0.05em' }}>
            📅 One Week (Weekly)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', color: '#3b82f6' }}>
            {stats.weekly_tasks || 0}
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.05em' }}>
            🗓️ One Month (Monthly)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', color: '#8b5cf6' }}>
            {stats.monthly_tasks || 0}
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#10b981', letterSpacing: '0.05em' }}>
            ✓ Completed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', color: '#10b981' }}>
            {stats.completed_tasks || 0}
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em' }}>
            ⚠️ Overdue
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.25rem', color: '#ef4444' }}>
            {stats.overdue_tasks || 0}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: 'var(--surface)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
            />
            <input
              type="text"
              placeholder="Search title, agent name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          {/* Filter Agent Checkbox Dropdown */}
          <AgentCheckboxDropdown
            agents={agents}
            selectedIds={filterAgentIds}
            onChange={(ids) => setFilterAgentIds(ids)}
            isFilter={true}
            minWidth="200px"
          />

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <option value="all">All Durations</option>
            <option value="daily">⚡ Per Day (Daily)</option>
            <option value="weekly">📅 One Week (Weekly)</option>
            <option value="monthly">🗓️ One Month (Monthly)</option>
            <option value="custom">⏱️ Custom</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">⏳ Pending</option>
            <option value="In Progress">🔄 In Progress</option>
            <option value="Completed">✓ Completed</option>
            <option value="Overdue">⚠️ Overdue</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => fetchTasks()}
          title="Refresh tasks"
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Task List / Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>
            Loading agent tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
            <CalendarClock size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3, color: 'var(--muted)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>No tasks found</h3>
            <p style={{ margin: '0.25rem 0 1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
              No tasks match the selected filters. Click below to assign a new task to an agent.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                background: 'var(--brand-blue, #0284c7)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + Assign Task
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Task & Duration
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Assigned Agent
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Time Limit / Deadline
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Priority
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const typeCfg = TYPE_CONFIG[task.task_type] || TYPE_CONFIG.daily;
                  const priorityCfg = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
                  const statusCfg = STATUS_COLORS[task.status] || STATUS_COLORS.Pending;
                  const StatusIcon = statusCfg.icon;
                  const dueInfo = formatDueDate(task.due_date);

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setViewDetailTask(task)}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                        transition: 'background 0.15s ease',
                        cursor: 'pointer',
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                      title="Click row to view full task details"
                    >
                      {/* Task & Duration */}
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: typeCfg.color,
                              background: typeCfg.bg,
                              border: `1px solid ${typeCfg.border}`,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <span>{typeCfg.icon}</span> {typeCfg.badgeText}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.9rem' }}>
                          {task.title}
                        </div>
                        {task.description && (
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: 'var(--muted)',
                              marginTop: '0.15rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '280px',
                            }}
                            title={task.description}
                          >
                            {task.description}
                          </div>
                        )}
                        {task.agent_remark && (
                          <div
                            style={{
                              marginTop: '0.35rem',
                              padding: '0.25rem 0.5rem',
                              background: 'var(--bg)',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              borderLeft: '3px solid #10b981',
                            }}
                          >
                            <strong style={{ color: '#10b981' }}>Agent Remark:</strong> {task.agent_remark}
                          </div>
                        )}
                      </td>

                      {/* Assigned Agent */}
                      <td style={{ padding: '0.85rem 1rem', minWidth: '170px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'rgba(2, 132, 199, 0.15)',
                              color: '#0284c7',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {task.agent_name ? task.agent_name.slice(0, 1).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{task.agent_name || 'Agent'}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                              {task.agent_city || 'City N/A'} · {task.agent_phone || ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Deadline / Time Limit */}
                      <td style={{ padding: '0.85rem 1rem', minWidth: '180px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>
                          {dueInfo.text}
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            marginTop: '0.2rem',
                            display: 'inline-block',
                            background: dueInfo.isOverdue
                              ? 'rgba(239, 68, 68, 0.12)'
                              : dueInfo.isDueSoon
                              ? 'rgba(245, 158, 11, 0.12)'
                              : 'rgba(100, 116, 139, 0.1)',
                            color: dueInfo.isOverdue ? '#ef4444' : dueInfo.isDueSoon ? '#d97706' : 'var(--muted)',
                          }}
                        >
                          {dueInfo.tag}
                        </span>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: priorityCfg.color,
                            background: priorityCfg.bg,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                          }}
                        >
                          {task.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: statusCfg.color,
                            background: statusCfg.bg,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <StatusIcon size={13} />
                          {task.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                          {task.status !== 'Completed' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatusChange(task, 'Completed');
                              }}
                              title="Mark as completed"
                              style={{
                                padding: '0.3rem 0.55rem',
                                borderRadius: '5px',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ✓ Done
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatusChange(task, 'Pending');
                              }}
                              title="Re-open task"
                              style={{
                                padding: '0.3rem 0.55rem',
                                borderRadius: '5px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                color: 'var(--muted)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Re-open
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(task);
                            }}
                            title="Edit task"
                            style={{
                              padding: '0.35rem 0.55rem',
                              borderRadius: '5px',
                              border: '1px solid var(--border)',
                              background: 'var(--bg)',
                              color: 'var(--text)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id, task.title);
                            }}
                            title="Delete task"
                            style={{
                              padding: '0.35rem 0.55rem',
                              borderRadius: '5px',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#ef4444',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface, #18181b)',
              border: '1px solid var(--border, #27272a)',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '560px',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarClock size={22} className="text-[#0284c7]" />
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>
                  Assign New Task to Agent
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Agent Selection */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Assign To Agent(s) * (Select 1, 2, or more)
                  </label>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.assign_to_all || (agents.length > 0 && form.agent_ids.length === agents.length)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((p) => ({
                          ...p,
                          assign_to_all: checked,
                          agent_ids: checked ? agents.map((a) => a.id) : [],
                        }));
                      }}
                    />
                    Assign to All ({agents.length}) Agents
                  </label>
                </div>

                <AgentCheckboxDropdown
                  agents={agents}
                  selectedIds={form.agent_ids}
                  onChange={(ids) => {
                    setForm((p) => ({
                      ...p,
                      agent_ids: ids,
                      assign_to_all: ids.length > 0 && ids.length === agents.length,
                    }));
                  }}
                  isFilter={false}
                  placeholder="Click to select 1, 2, or more agents..."
                  width="100%"
                />

                {/* Selected Agents Removable Chips */}
                {form.agent_ids.length > 0 && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284c7' }}>
                        ✓ {form.agent_ids.length} Agent(s) Selected for this Task/Lead
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, agent_ids: [], assign_to_all: false }))}
                        style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Clear all
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '110px', overflowY: 'auto' }}>
                      {form.agent_ids.map((id) => {
                        const ag = agents.find((a) => a.id === id);
                        if (!ag) return null;
                        return (
                          <span
                            key={id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '20px',
                              background: 'rgba(2, 132, 199, 0.12)',
                              border: '1px solid rgba(2, 132, 199, 0.3)',
                              color: 'var(--text)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            <span>{ag.name}</span>
                            {ag.city && <span style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>({ag.city})</span>}
                            <button
                              type="button"
                              onClick={() => {
                                setForm((p) => ({
                                  ...p,
                                  agent_ids: p.agent_ids.filter((aid) => aid !== id),
                                  assign_to_all: false,
                                }));
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 900,
                                lineHeight: 1,
                              }}
                              title="Remove agent"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Task Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call 10 fresh leads in Bareilly / Site Inspection"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Task Duration / Time Limit Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  Task Time Limit / Duration *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                  {[
                    { id: 'daily', title: 'Per Day', sub: 'Today (24h)', icon: '⚡' },
                    { id: 'weekly', title: 'One Week', sub: '7 Days', icon: '📅' },
                    { id: 'monthly', title: 'One Month', sub: '30 Days', icon: '🗓️' },
                    { id: 'custom', title: 'Custom', sub: 'Pick Date', icon: '⏱️' },
                  ].map((item) => {
                    const isSelected = form.task_type === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, task_type: item.id }))}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--brand-blue, #0284c7)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg)',
                          color: isSelected ? '#0284c7' : 'var(--text)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ fontSize: '1.1rem' }}>{item.icon}</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600 }}>{item.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Date Picker (if custom selected) */}
              {form.task_type === 'custom' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Select Custom Deadline Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.due_date}
                    onChange={(e) => setForm((p) => ({ ...p, due_date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              )}

              {/* Priority */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Priority Level
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Low', 'Medium', 'High', 'Urgent'].map((p) => {
                    const isSelected = form.priority === p;
                    const cfg = PRIORITY_COLORS[p];
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                        style={{
                          padding: '0.4rem 0.9rem',
                          borderRadius: '6px',
                          border: isSelected ? `2px solid ${cfg.color}` : '1px solid var(--border)',
                          background: isSelected ? cfg.bg : 'var(--bg)',
                          color: isSelected ? cfg.color : 'var(--muted)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description / Instructions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Task Instructions / Targets
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide instructions, target quotas, meeting locations, or client names..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--muted)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.55rem 1.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--brand-blue, #0284c7)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {showEditModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowEditModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface, #18181b)',
              border: '1px solid var(--border, #27272a)',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '560px',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>
                Edit Task #{editForm.id}
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Duration Type
                  </label>
                  <select
                    value={editForm.task_type}
                    onChange={(e) => setEditForm((p) => ({ ...p, task_type: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="daily">⚡ Per Day (Daily)</option>
                    <option value="weekly">📅 One Week (Weekly)</option>
                    <option value="monthly">🗓️ One Month (Monthly)</option>
                    <option value="custom">⏱️ Custom Deadline</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm((p) => ({ ...p, priority: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Deadline Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.due_date}
                    onChange={(e) => setEditForm((p) => ({ ...p, due_date: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Description / Instructions
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Agent Remark / Work Notes
                </label>
                <textarea
                  rows={2}
                  value={editForm.agent_remark}
                  onChange={(e) => setEditForm((p) => ({ ...p, agent_remark: e.target.value }))}
                  placeholder="Notes entered by agent or admin..."
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', background: 'var(--brand-blue, #0284c7)', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAIL MODAL */}
      {viewDetailTask && (() => {
        const typeCfg = TYPE_CONFIG[viewDetailTask.task_type] || TYPE_CONFIG.daily;
        const priorityCfg = PRIORITY_COLORS[viewDetailTask.priority] || PRIORITY_COLORS.Medium;
        const statusCfg = STATUS_COLORS[viewDetailTask.status] || STATUS_COLORS.Pending;
        const StatusIcon = statusCfg.icon;
        const dueInfo = formatDueDate(viewDetailTask.due_date);

        return (
          <div
            className="modal-backdrop"
            onClick={() => setViewDetailTask(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1rem',
            }}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--surface, #18181b)',
                border: '1px solid var(--border, #27272a)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '620px',
                padding: '1.75rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: typeCfg.color,
                        background: typeCfg.bg,
                        border: `1px solid ${typeCfg.border}`,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span>{typeCfg.icon}</span> {typeCfg.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: priorityCfg.color,
                        background: priorityCfg.bg,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                      }}
                    >
                      {viewDetailTask.priority} Priority
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: statusCfg.color,
                        background: statusCfg.bg,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <StatusIcon size={13} /> {viewDetailTask.status}
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text)' }}>
                    {viewDetailTask.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setViewDetailTask(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid: Agent info + Timeline info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {/* Agent Card */}
                <div style={{ padding: '0.9rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Assigned Agent
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontWeight: 900, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {viewDetailTask.agent_name ? viewDetailTask.agent_name.slice(0, 1).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {viewDetailTask.agent_name || 'Agent'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {viewDetailTask.agent_city || 'City N/A'}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {viewDetailTask.agent_phone && (
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Phone: </span>
                        <a href={`tel:${viewDetailTask.agent_phone}`} style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                          {viewDetailTask.agent_phone}
                        </a>
                      </div>
                    )}
                    {viewDetailTask.agent_email && (
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Email: </span>
                        <a href={`mailto:${viewDetailTask.agent_email}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                          {viewDetailTask.agent_email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Card */}
                <div style={{ padding: '0.9rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                    Deadline & Timeline
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)' }}>
                    {dueInfo.text}
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        background: dueInfo.isOverdue
                          ? 'rgba(239, 68, 68, 0.15)'
                          : dueInfo.isDueSoon
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(59, 130, 246, 0.12)',
                        color: dueInfo.isOverdue ? '#ef4444' : dueInfo.isDueSoon ? '#d97706' : '#3b82f6',
                      }}
                    >
                      {dueInfo.tag}
                    </span>
                  </div>
                  <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
                    Assigned: {viewDetailTask.created_at ? new Date(viewDetailTask.created_at).toLocaleString('en-IN') : '-'}
                  </div>
                  {viewDetailTask.completed_at && (
                    <div style={{ marginTop: '0.2rem', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ Completed: {new Date(viewDetailTask.completed_at).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Description / Instructions */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
                  Task Instructions & Description
                </div>
                <div
                  style={{
                    padding: '0.9rem',
                    background: 'var(--bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {viewDetailTask.description || 'No detailed instructions provided.'}
                </div>
              </div>

              {/* Agent Submission Remark */}
              {viewDetailTask.agent_remark && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#10b981', marginBottom: '0.35rem' }}>
                    Agent Completion Remark / Report
                  </div>
                  <div
                    style={{
                      padding: '0.9rem',
                      background: 'rgba(16, 185, 129, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      color: 'var(--text)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {viewDetailTask.agent_remark}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {viewDetailTask.status !== 'Completed' ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleQuickStatusChange(viewDetailTask, 'Completed');
                        setViewDetailTask((p) => ({ ...p, status: 'Completed', completed_at: new Date().toISOString() }));
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Mark Completed
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleQuickStatusChange(viewDetailTask, 'Pending');
                        setViewDetailTask((p) => ({ ...p, status: 'Pending', completed_at: null }));
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        color: 'var(--muted)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Re-open Task
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const t = viewDetailTask;
                      setViewDetailTask(null);
                      handleEditClick(t);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Pencil size={13} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const t = viewDetailTask;
                      setViewDetailTask(null);
                      handleDeleteTask(t.id, t.title);
                    }}
                    style={{
                      padding: '0.5rem 0.9rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewDetailTask(null)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
