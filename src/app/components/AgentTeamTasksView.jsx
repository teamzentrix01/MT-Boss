'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  X,
  User,
  Users,
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
    label: 'Custom Limit',
    badgeText: 'Custom Limit',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.3)',
    icon: '⏱️',
  },
};

const PRIORITY_BADGES = {
  Low: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
  Medium: { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' },
  High: { color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)' },
  Urgent: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' },
};

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return { text: 'No deadline', tag: 'No deadline' };
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
      text: `${dateFormatted} at ${timeFormatted}`,
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

function TeamAgentCheckboxDropdown({
  agents = [],
  selectedIds = [],
  onChange,
  placeholder = 'Select Agent(s)...',
  isFilter = false,
  minWidth = '220px',
  width = 'auto',
  dark = false,
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
      buttonLabel = `All Team Agents (${agents.length})`;
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
      buttonLabel = `All Team Agents (${agents.length} selected)`;
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
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
          dark
            ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-600'
            : 'bg-white border-zinc-300 text-zinc-800 hover:border-zinc-400'
        }`}
        style={{ minHeight: '36px' }}
      >
        <span className="truncate flex-1 text-left">{buttonLabel}</span>
        <ChevronDown
          size={14}
          className="text-zinc-400 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-[calc(100%+4px)] left-0 z-50 p-2.5 rounded-xl border shadow-2xl ${
            dark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
          style={{
            minWidth: width === '100%' ? '100%' : '270px',
            maxWidth: '360px',
            right: width === '100%' ? 0 : 'auto',
          }}
        >
          {/* Quick Search */}
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search team agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-8 pr-2 py-1.5 rounded-lg border text-xs ${
                dark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-200 dark:border-zinc-800 text-[11px]">
            <span className="text-zinc-500 font-bold">
              {selectedIds.length === 0 && isFilter
                ? `All ${agents.length} shown`
                : `${selectedIds.length} of ${agents.length} selected`}
            </span>
            <div className="flex gap-2 font-bold">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sky-600 hover:underline"
              >
                Select All
              </button>
              <span className="text-zinc-400">|</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* All Team Agents Checkbox */}
          <label
            className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-xs font-bold mb-1 ${
              allSelected
                ? 'bg-sky-500/10 text-sky-600'
                : dark
                ? 'hover:bg-zinc-800/60 text-zinc-200'
                : 'hover:bg-zinc-100 text-zinc-800'
            }`}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => (allSelected ? handleClear() : handleSelectAll())}
              className="cursor-pointer"
            />
            <span>All Team Agents ({agents.length})</span>
          </label>

          {/* Agents List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredAgents.length === 0 ? (
              <div className="p-3 text-center text-xs text-zinc-500">No agents match search</div>
            ) : (
              filteredAgents.map((ag) => {
                const checked = selectedIds.includes(ag.id);
                return (
                  <label
                    key={ag.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                      checked
                        ? 'bg-sky-500/15 border border-sky-500/30'
                        : dark
                        ? 'hover:bg-zinc-800/60 border border-transparent'
                        : 'hover:bg-zinc-100 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleAgent(ag.id)}
                      className="cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate text-zinc-800 dark:text-zinc-100">
                        {ag.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
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

export default function AgentTeamTasksView({ dark = false }) {
  const [tasks, setTasks] = useState([]);
  const [teamAgents, setTeamAgents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterAgentIds, setFilterAgentIds] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Create Form
  const [form, setForm] = useState({
    agent_ids: [],
    assign_to_all: false,
    title: '',
    description: '',
    task_type: 'daily',
    priority: 'Medium',
    due_date: '',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const authFetch = useCallback((url, opts = {}) => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('agent-token') || localStorage.getItem('token')) : '';
    return fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(opts.headers || {}),
      },
    });
  }, []);

  const fetchTeamTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterAgentIds && filterAgentIds.length > 0 && filterAgentIds.length < teamAgents.length) {
        params.set('agent_ids', filterAgentIds.join(','));
      }
      if (filterType && filterType !== 'all') params.set('task_type', filterType);
      if (filterStatus && filterStatus !== 'all') params.set('status', filterStatus);
      if (search.trim()) params.set('search', search.trim());

      const res = await authFetch(`/api/agent/team-tasks?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
        setTeamAgents(data.team_agents || []);
        setStats(data.stats || {});
      } else {
        showToast(data.error || 'Could not load team tasks');
      }
    } catch (err) {
      console.error('Error fetching team tasks:', err);
      showToast('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [authFetch, filterAgentIds, filterType, filterStatus, search, teamAgents.length]);

  useEffect(() => {
    fetchTeamTasks();
  }, [fetchTeamTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.assign_to_all && (!form.agent_ids || form.agent_ids.length === 0)) {
      alert('Please select at least 1 agent from the dropdown.');
      return;
    }
    if (!form.title.trim()) {
      alert('Task title is required.');
      return;
    }

    try {
      setSaving(true);
      const res = await authFetch('/api/agent/team-tasks', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Task successfully assigned to team!');
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
        fetchTeamTasks();
      } else {
        alert(data.error || 'Could not assign task to team.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while assigning team task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete task "${title}"?`)) return;
    try {
      const res = await authFetch(`/api/agent/team-tasks?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Team task deleted');
        fetchTeamTasks();
      } else {
        alert(data.error || 'Failed to delete task');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  const cardBg = dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200';
  const textTitle = dark ? 'text-zinc-100' : 'text-zinc-900';
  const textMuted = dark ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* Top Banner / Header */}
      <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md">
              <Users size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-black ${textTitle}`}>My Team Task Management</h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/20">
                  Manager Portal
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${textMuted}`}>
                Assign daily, weekly, and monthly tasks to your team agents, track real-time progress, and report to Admin.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} /> Assign Task to Team
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Team Tasks</div>
          <div className={`text-2xl font-black mt-1 ${textTitle}`}>{stats.total_tasks || 0}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">⚡ Per Day (Daily)</div>
          <div className="text-2xl font-black mt-1 text-amber-500">{stats.daily_tasks || 0}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500">📅 One Week</div>
          <div className="text-2xl font-black mt-1 text-blue-500">{stats.weekly_tasks || 0}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500">🗓️ One Month</div>
          <div className="text-2xl font-black mt-1 text-purple-500">{stats.monthly_tasks || 0}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">✓ Completed</div>
          <div className="text-2xl font-black mt-1 text-emerald-500">{stats.completed_tasks || 0}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-red-500">⚠️ Overdue</div>
          <div className="text-2xl font-black mt-1 text-red-500">{stats.overdue_tasks || 0}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-3.5 rounded-xl border ${cardBg} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search title, agent name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${
                dark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
          </div>

          {/* Team Agent Checkbox Dropdown */}
          <TeamAgentCheckboxDropdown
            agents={teamAgents}
            selectedIds={filterAgentIds}
            onChange={(ids) => setFilterAgentIds(ids)}
            isFilter={true}
            minWidth="200px"
            dark={dark}
          />

          {/* Duration Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold ${
              dark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          >
            <option value="all">All Durations</option>
            <option value="daily">⚡ Per Day (Daily)</option>
            <option value="weekly">📅 One Week (Weekly)</option>
            <option value="monthly">🗓️ One Month (Monthly)</option>
            <option value="custom">⏱️ Custom</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold ${
              dark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
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
          onClick={() => fetchTeamTasks()}
          title="Refresh team tasks"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
            dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Task List / Table */}
      <div className={`rounded-xl border ${cardBg} overflow-hidden shadow-sm`}>
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-zinc-500">
            Loading team tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarClock size={40} className="mx-auto mb-2 opacity-30 text-zinc-500" />
            <h3 className={`text-base font-black ${textTitle}`}>No tasks found</h3>
            <p className="text-xs text-zinc-500 mt-1">
              No tasks match the selected filters. Click below to assign a new task to your team.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md hover:bg-sky-500"
            >
              + Assign First Task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={dark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-zinc-50 text-zinc-500'}>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Task & Duration</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Assigned Agent</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Deadline</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Priority</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">Agent Report</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tasks.map((task) => {
                  const typeCfg = TYPE_CONFIG[task.task_type] || TYPE_CONFIG.daily;
                  const priorityCfg = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium;
                  const dueInfo = formatDueDate(task.due_date);
                  const isCompleted = task.status === 'Completed';

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedDetailTask(task)}
                      className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors ${
                        isCompleted ? 'opacity-80' : ''
                      }`}
                    >
                      {/* Task & Duration */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              color: typeCfg.color,
                              background: typeCfg.bg,
                              border: `1px solid ${typeCfg.border}`,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '999px',
                            }}
                          >
                            {typeCfg.icon} {typeCfg.badgeText}
                          </span>
                        </div>
                        <div className={`font-black text-xs ${textTitle} truncate`}>{task.title}</div>
                        {task.description && (
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">{task.description}</div>
                        )}
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                            {task.agent_name?.[0]?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <div className={`font-bold text-xs ${textTitle}`}>{task.agent_name}</div>
                            <div className="text-[10px] text-zinc-500">
                              {task.agent_city || 'No City'} · {task.agent_phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4">
                        <div className={`font-bold text-xs ${textTitle}`}>{dueInfo.text}</div>
                        <div
                          className={`text-[10px] font-bold mt-0.5 ${
                            isCompleted
                              ? 'text-emerald-500'
                              : dueInfo.isOverdue
                              ? 'text-red-500'
                              : dueInfo.isDueSoon
                              ? 'text-amber-500'
                              : 'text-sky-500'
                          }`}
                        >
                          {dueInfo.tag}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: priorityCfg.color,
                            background: priorityCfg.bg,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                          }}
                        >
                          {task.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-600'
                              : task.status === 'In Progress'
                              ? 'bg-sky-500/15 text-sky-600'
                              : task.status === 'Overdue'
                              ? 'bg-red-500/15 text-red-600'
                              : 'bg-zinc-500/15 text-zinc-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {task.status}
                        </span>
                      </td>

                      {/* Agent Report */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {task.agent_remark ? (
                          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                            <span className="font-bold">✓ </span>{task.agent_remark}
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-[11px] italic">No report yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedDetailTask(task)}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            title="View task detail"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100"
                            title="Delete task"
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

      {/* CREATE TEAM TASK MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${cardBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-sky-600" />
                <h3 className={`text-base font-black ${textTitle}`}>Assign Task to Team</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Agent Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Assign To Team Agent(s) *
                  </label>
                  <label className="text-xs font-bold text-sky-600 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.assign_to_all || (teamAgents.length > 0 && form.agent_ids.length === teamAgents.length)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((p) => ({
                          ...p,
                          assign_to_all: checked,
                          agent_ids: checked ? teamAgents.map((a) => a.id) : [],
                        }));
                      }}
                    />
                    Assign to All ({teamAgents.length}) Agents
                  </label>
                </div>

                <TeamAgentCheckboxDropdown
                  agents={teamAgents}
                  selectedIds={form.agent_ids}
                  onChange={(ids) => {
                    setForm((p) => ({
                      ...p,
                      agent_ids: ids,
                      assign_to_all: ids.length > 0 && ids.length === teamAgents.length,
                    }));
                  }}
                  isFilter={false}
                  placeholder="Click to select 1, 2, or more agents..."
                  width="100%"
                  dark={dark}
                />

                {/* Removable chips */}
                {form.agent_ids.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-sky-600">
                        ✓ {form.agent_ids.length} Agent(s) selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, agent_ids: [], assign_to_all: false }))}
                        className="text-zinc-400 underline hover:text-zinc-600"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {form.agent_ids.map((id) => {
                        const ag = teamAgents.find((a) => a.id === id);
                        if (!ag) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300"
                          >
                            <span>{ag.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setForm((p) => ({
                                  ...p,
                                  agent_ids: p.agent_ids.filter((aid) => aid !== id),
                                  assign_to_all: false,
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 font-black ml-0.5"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call 10 fresh leads in Moradabad / Client Site Visit"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${
                    dark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Instructions & Client Details (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide client details, phone numbers, or exact instructions for the agent..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-xs leading-relaxed ${
                    dark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              {/* Time Limit / Type & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Time Limit / Type *
                  </label>
                  <select
                    value={form.task_type}
                    onChange={(e) => setForm((p) => ({ ...p, task_type: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                      dark ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="daily">⚡ Per Day Task (24h limit)</option>
                    <option value="weekly">📅 One Week Task (7 Days limit)</option>
                    <option value="monthly">🗓️ One Month Task (30 Days limit)</option>
                    <option value="custom">⏱️ Custom Deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold ${
                      dark ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">🔥 Urgent</option>
                  </select>
                </div>
              </div>

              {/* Custom Due Date */}
              {form.task_type === 'custom' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Custom Deadline Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.due_date}
                    onChange={(e) => setForm((p) => ({ ...p, due_date: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      dark ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shadow-md disabled:opacity-50"
                >
                  {saving ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedDetailTask && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedDetailTask(null)}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${cardBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-600 px-2 py-0.5 rounded-full mb-1 inline-block">
                  {selectedDetailTask.task_type?.toUpperCase()} TASK
                </span>
                <h3 className={`text-base font-black ${textTitle}`}>{selectedDetailTask.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailTask(null)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Task Info Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 mb-4 text-xs">
              <div>
                <div className="text-[10px] font-bold uppercase text-zinc-500">Assigned Agent</div>
                <div className={`font-bold mt-0.5 ${textTitle}`}>{selectedDetailTask.agent_name}</div>
                <div className="text-[10px] text-zinc-400">{selectedDetailTask.agent_city} · {selectedDetailTask.agent_phone}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-zinc-500">Status</div>
                <div className="font-black mt-0.5 text-sky-600">{selectedDetailTask.status}</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Instructions</div>
              <div className={`p-3 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${dark ? 'bg-zinc-800/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                {selectedDetailTask.description || 'No additional instructions provided.'}
              </div>
            </div>

            {/* Agent Submitted Report */}
            {selectedDetailTask.agent_remark && (
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase text-emerald-600 mb-1">
                  Agent Submitted Report / Remark
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 font-semibold">
                  {selectedDetailTask.agent_remark}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedDetailTask(null)}
                className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
