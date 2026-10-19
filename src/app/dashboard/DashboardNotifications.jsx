"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

const STORAGE_KEY = "mtboss-admin-notifications-v1";
const POLL_INTERVAL = 60_000;

function eventSignature(item) {
  return `${item.kind}:${item.id}:${item.status || ""}:${item.updated_at || item.created_at || ""}`;
}

function readStored() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      initialized: Boolean(value.initialized),
      signatures: value.signatures || {},
      notifications: Array.isArray(value.notifications) ? value.notifications : [],
    };
  } catch {
    return { initialized: false, signatures: {}, notifications: [] };
  }
}

export default function DashboardNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef(null);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("admin-token") || localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const responses = await Promise.all([
        fetch("/api/primary-service-enquiries", { headers, cache: "no-store" }),
        fetch("/api/contact", { headers, cache: "no-store" }),
        fetch("/api/admin/lead-management?lite=1&limit=100", { headers, cache: "no-store" }),
      ]);
      const [enquiries, submissions, leads] = await Promise.all(
        responses.map((response) => response.json()),
      );
      if (!responses.every((response) => response.ok) || ![enquiries, submissions, leads].every((result) => result?.success)) {
        setLoading(false);
        return;
      }

      const currentItems = [
        ...(enquiries?.success ? (enquiries.data || []).map((item) => ({
          kind: "enquiry", id: item.id, status: item.status, updated_at: item.updated_at,
          created_at: item.created_at, name: item.name || "A customer", detail: item.service_title || "Service enquiry",
          href: "/dashboard?tab=primary-service-enquiries", label: "New enquiry",
        })) : []),
        ...(submissions?.success ? (submissions.data || []).map((item) => ({
          kind: "submission", id: item.id, status: item.status, updated_at: item.updated_at,
          created_at: item.created_at, name: item.name || "A visitor", detail: item.subject || item.department || "Contact form",
          href: "/dashboard?tab=submissions", label: "Contact form update",
        })) : []),
        ...(leads?.success ? (leads.data || []).map((item) => ({
          kind: "lead", id: item.id, status: item.status || item.lead_stage, updated_at: item.updated_at,
          created_at: item.created_at, name: item.client_name || "A customer", detail: item.service_type || item.lead_source || "Lead",
          href: "/dashboard?tab=lead-management", label: "Lead update",
        })) : []),
      ].filter((item) => item.id != null);

      const stored = readStored();
      const signatures = { ...stored.signatures };
      const nextNotifications = [...stored.notifications];

      if (stored.initialized) {
        for (const item of currentItems) {
          const signature = eventSignature(item);
          const key = `${item.kind}:${item.id}`;
          const previous = signatures[key];
          if (previous && previous !== signature) {
            nextNotifications.unshift({
              key: `${signature}:${Date.now()}`,
              title: item.status ? `${item.label}: ${item.status}` : item.label,
              message: `${item.name} · ${item.detail}`,
              href: item.href,
              createdAt: new Date().toISOString(),
              read: false,
            });
          } else if (!previous) {
            nextNotifications.unshift({
              key: `${signature}:${Date.now()}`,
              title: item.label,
              message: `${item.name} · ${item.detail}`,
              href: item.href,
              createdAt: item.created_at || new Date().toISOString(),
              read: false,
            });
          }
          signatures[key] = signature;
        }
      } else {
        for (const item of currentItems) signatures[`${item.kind}:${item.id}`] = eventSignature(item);
      }

      const unique = [...new Map(nextNotifications.map((item) => [item.key, item])).values()].slice(0, 50);
      const next = { initialized: true, signatures, notifications: unique };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setNotifications(unique);
    } catch (error) {
      console.error("Dashboard notifications could not be refreshed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, POLL_INTERVAL);
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const markAllRead = () => {
    const updated = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(updated);
    const stored = readStored();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, notifications: updated }));
  };

  return (
    <div className="admin-notifications" ref={rootRef}>
      <button
        type="button"
        className="admin-notifications__trigger"
        aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={20} strokeWidth={1.8} aria-hidden="true" />
        {unreadCount > 0 && <span className="admin-notifications__count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && (
        <section className="admin-notifications__panel" aria-label="Notifications">
          <header className="admin-notifications__header">
            <div>
              <h2>Notifications</h2>
              <p>{unreadCount ? `${unreadCount} unread updates` : "You’re all caught up"}</p>
            </div>
            {unreadCount > 0 && <button type="button" onClick={markAllRead} aria-label="Mark all as read"><CheckCheck size={18} /></button>}
          </header>
          <div className="admin-notifications__list">
            {notifications.length ? notifications.map((item) => (
              <Link
                href={item.href}
                key={item.key}
                className={`admin-notifications__item${item.read ? " is-read" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="admin-notifications__dot" />
                <span className="admin-notifications__copy">
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                  <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</time>
                </span>
              </Link>
            )) : (
              <p className="admin-notifications__empty">{loading ? "Checking for updates…" : "New enquiries and lead updates will appear here."}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
