'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Plus,
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
    label: 'Custom Task',
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
      tag: diffHours <= 1 ? 'Due in < 1 hour' : `Due in ${diffHours} hours`,
      isDueSoon: true,
      time: timeFormatted,
    };
  }

  return {
    text: `${dateFormatted} at ${timeFormatted}`,
    tag: `${diffDays} days remaining`,
    isUpcoming: true,
    time: timeFormatted,
  };
}

export default function AgentTasksView({
  tasks = [],
  stats = {},
  loading = false,
  onRefresh = () => {},
  onUpdateStatus = () => {},
  dark = false,
}) {
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'daily', 'weekly', 'monthly', 'completed'
  const [statusFilter, setStatusFilter] = useState('all');
  const [completeModalTask, setCompleteModalTask] = useState(null);
  const [selectedDetailTask, setSelectedDetailTask] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeSubTab === 'daily' && t.task_type !== 'daily') return false;
      if (activeSubTab === 'weekly' && t.task_type !== 'weekly') return false;
      if (activeSubTab === 'monthly' && t.task_type !== 'monthly') return false;
      if (activeSubTab === 'completed' && t.status !== 'Completed') return false;

      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, activeSubTab, statusFilter]);

  const handleOpenCompleteModal = (task) => {
    setCompleteModalTask(task);
    setRemarkText(task.agent_remark || '');
  };

  const handleSubmitComplete = async (e) => {
    e.preventDefault();
    if (!completeModalTask) return;
    setSubmitting(true);
    try {
      await onUpdateStatus(completeModalTask.id, 'Completed', remarkText);
      setCompleteModalTask(null);
      setRemarkText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartTask = async (task) => {
    await onUpdateStatus(task.id, 'In Progress', task.agent_remark || '');
  };

  const cardBg = dark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200';
  const textTitle = dark ? 'text-white' : 'text-zinc-900';
  const textMuted = dark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className={`border ${cardBg} p-4 rounded-xl`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Tasks</div>
          <div className={`text-2xl font-black mt-1 ${textTitle}`}>{stats.total_tasks || 0}</div>
        </div>

        <div className={`border ${cardBg} p-4 rounded-xl`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-500">⚡ Per Day (Daily)</div>
          <div className="text-2xl font-black mt-1 text-amber-500">{stats.daily_tasks || 0}</div>
        </div>

        <div className={`border ${cardBg} p-4 rounded-xl`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-blue-500">📅 One Week</div>
          <div className="text-2xl font-black mt-1 text-blue-500">{stats.weekly_tasks || 0}</div>
        </div>

        <div className={`border ${cardBg} p-4 rounded-xl`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-purple-500">🗓️ One Month</div>
          <div className="text-2xl font-black mt-1 text-purple-500">{stats.monthly_tasks || 0}</div>
        </div>

        <div className={`border ${cardBg} p-4 rounded-xl`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-500">✓ Completed</div>
          <div className="text-2xl font-black mt-1 text-emerald-500">{stats.completed_tasks || 0}</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter */}
      <div className={`border ${cardBg} p-3 rounded-xl flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Tasks', count: tasks.length },
            { id: 'daily', label: '⚡ Per Day', count: stats.daily_tasks || 0 },
            { id: 'weekly', label: '📅 One Week', count: stats.weekly_tasks || 0 },
            { id: 'monthly', label: '🗓️ One Month', count: stats.monthly_tasks || 0 },
            { id: 'completed', label: '✓ Completed', count: stats.completed_tasks || 0 },
          ].map((tab) => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  active
                    ? 'bg-[var(--brand-blue,#0284c7)] text-white shadow-xs'
                    : dark
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    active ? 'bg-white/20 text-white' : 'bg-zinc-500/10 text-zinc-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab !== 'completed' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
                dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">🔄 In Progress</option>
              <option value="Completed">✓ Completed</option>
              <option value="Overdue">⚠️ Overdue</option>
            </select>
          )}

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh Tasks"
            className={`p-1.5 rounded-lg border ${
              dark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      {loading ? (
        <div className="py-12 text-center text-sm font-semibold text-zinc-500">
          Loading assigned tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className={`border ${cardBg} p-12 rounded-xl text-center`}>
          <CalendarClock size={40} className="mx-auto mb-2 opacity-30 text-zinc-500" />
          <h3 className={`text-base font-black ${textTitle}`}>No tasks found</h3>
          <p className="text-xs text-zinc-500 mt-1">
            You currently have no tasks matching this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const typeCfg = TYPE_CONFIG[task.task_type] || TYPE_CONFIG.daily;
            const priorityCfg = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium;
            const dueInfo = formatDueDate(task.due_date);
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                onClick={() => setSelectedDetailTask(task)}
                className={`border ${cardBg} rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer ${
                  isCompleted ? 'opacity-85' : ''
                }`}
                title="Click to view task details"
                style={{
                  borderLeft: `4px solid ${
                    isCompleted ? '#10b981' : dueInfo.isOverdue ? '#ef4444' : typeCfg.color
                  }`,
                }}
              >
                <div>
                  {/* Badges Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
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
                      <span>{typeCfg.icon}</span> {typeCfg.label}
                    </span>

                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: priorityCfg.color,
                        background: priorityCfg.bg,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h4 className={`text-sm font-black ${textTitle} leading-snug`}>
                    {task.title}
                  </h4>

                  {/* Description */}
                  {task.description && (
                    <p className={`text-xs mt-2 leading-relaxed ${textMuted} whitespace-pre-line`}>
                      {task.description}
                    </p>
                  )}

                  {/* Agent Remark (if submitted) */}
                  {task.agent_remark && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <span className="font-bold text-emerald-600 block mb-0.5">Your Submission Remark:</span>
                      <span className={dark ? 'text-zinc-200' : 'text-zinc-800'}>{task.agent_remark}</span>
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  {/* Deadline & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Deadline</div>
                      <div className={`text-xs font-bold mt-0.5 ${textTitle}`}>
                        {dueInfo.text}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : dueInfo.isOverdue
                          ? 'bg-red-500/15 text-red-600'
                          : dueInfo.isDueSoon
                          ? 'bg-amber-500/15 text-amber-600'
                          : 'bg-blue-500/15 text-blue-600'
                      }`}
                    >
                      {isCompleted ? '✓ Completed' : dueInfo.tag}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCompleteModal(task);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Edit Remark
                      </button>
                    ) : (
                      <>
                        {task.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTask(task);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-lg border border-blue-300 dark:border-blue-700/50 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            Start Task
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCompleteModal(task);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[var(--brand-blue,#0284c7)] text-white text-xs font-black shadow-xs hover:opacity-90 transition-opacity"
                        >
                          Mark Completed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COMPLETE / SUBMISSION MODAL */}
      {completeModalTask && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setCompleteModalTask(null)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 border ${cardBg} shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-black ${textTitle}`}>
                Submit Task Completion
              </h3>
              <button
                type="button"
                onClick={() => setCompleteModalTask(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-xs">
              <div className="font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Task:</div>
              <div className={`font-bold mt-0.5 text-sm ${textTitle}`}>{completeModalTask.title}</div>
            </div>

            <form onSubmit={handleSubmitComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Work Notes / Completion Remark *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the action taken (e.g. Visited client site at Bareilly, quotes delivered to 5 customers)..."
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : '✓ Confirm Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGENT TASK DETAIL MODAL */}
      {selectedDetailTask && (() => {
        const typeCfg = TYPE_CONFIG[selectedDetailTask.task_type] || TYPE_CONFIG.daily;
        const priorityCfg = PRIORITY_BADGES[selectedDetailTask.priority] || PRIORITY_BADGES.Medium;
        const dueInfo = formatDueDate(selectedDetailTask.due_date);
        const isCompleted = selectedDetailTask.status === 'Completed';

        return (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDetailTask(null)}
          >
            <div
              className={`w-full max-w-lg rounded-2xl p-6 border ${cardBg} shadow-2xl max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      <span>{typeCfg.icon}</span> {typeCfg.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: priorityCfg.color,
                        background: priorityCfg.bg,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                      }}
                    >
                      {selectedDetailTask.priority}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : dueInfo.isOverdue
                          ? 'bg-red-500/15 text-red-600'
                          : dueInfo.isDueSoon
                          ? 'bg-amber-500/15 text-amber-600'
                          : 'bg-blue-500/15 text-blue-600'
                      }`}
                    >
                      {isCompleted ? '✓ Completed' : dueInfo.tag}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black ${textTitle}`}>{selectedDetailTask.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetailTask(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Deadline card */}
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Target Deadline</div>
                  <div className={`text-xs font-extrabold mt-0.5 ${textTitle}`}>{dueInfo.text}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</div>
                  <div className={`text-xs font-black mt-0.5 ${isCompleted ? 'text-emerald-500' : 'text-blue-500'}`}>
                    {selectedDetailTask.status}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Full Instructions & Targets
                </div>
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                    dark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                  }`}
                >
                  {selectedDetailTask.description || 'No detailed instructions provided.'}
                </div>
              </div>

              {/* Agent Remark */}
              {selectedDetailTask.agent_remark && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                    Your Submitted Report / Notes
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {selectedDetailTask.agent_remark}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {!isCompleted ? (
                  <>
                    {selectedDetailTask.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => {
                          const t = selectedDetailTask;
                          setSelectedDetailTask(null);
                          handleStartTask(t);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-blue-300 dark:border-blue-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        Start Working
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const t = selectedDetailTask;
                        setSelectedDetailTask(null);
                        handleOpenCompleteModal(t);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-[var(--brand-blue,#0284c7)] text-white hover:opacity-90"
                    >
                      Mark Completed
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const t = selectedDetailTask;
                      setSelectedDetailTask(null);
                      handleOpenCompleteModal(t);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Update Remark
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDetailTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
