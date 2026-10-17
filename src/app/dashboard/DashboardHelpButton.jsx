"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, Phone } from "@/app/components/ui/icons";

export default function DashboardHelpButton({ phoneHref, whatsappHref }) {
  const [open, setOpen] = useState(false);

  const openAssistant = () => {
    window.dispatchEvent(new Event("mtboss:open-chat"));
    setOpen(false);
  };

  return (
    <div className="admin-help-dock">
      {open && (
        <div className="admin-help-menu" role="menu" aria-label="Help options">
          <button type="button" role="menuitem" onClick={openAssistant}>
            <MessageSquare size={18} strokeWidth={1.7} aria-hidden="true" />
            Ask MTBoss AI
          </button>
          <a role="menuitem" href={phoneHref}>
            <Phone size={18} strokeWidth={1.7} aria-hidden="true" />
            Call support
          </a>
          <a role="menuitem" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageSquare size={18} strokeWidth={1.7} aria-hidden="true" />
            WhatsApp support
          </a>
        </div>
      )}
      <button
        type="button"
        className="admin-help-button"
        aria-label={open ? "Close help options" : "Open help options"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <HelpCircle size={20} strokeWidth={1.7} aria-hidden="true" />
        <span>Help</span>
      </button>
    </div>
  );
}