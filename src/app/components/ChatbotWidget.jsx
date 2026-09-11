'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { label: '🧮 Cost Calculator', href: '/calculator', prompt: 'What are the current house construction rates and packages?' },
  { label: '📦 Buy Materials', href: '/ShopNow', prompt: 'What are the wholesale prices for Cement and TMT Steel?' },
  { label: '🏠 Bareilly Plots', href: '/buy-sale', prompt: 'Show me verified plots and properties in Bareilly and UP' },
  { label: '💼 Franchise Info', href: '/franchise', prompt: 'What are the MT-Boss franchise investment models and requirements?' },
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: `Hello & Welcome to **MTBOSS Construction**! 🏗️

I am your official AI Project Advisor. You can ask me anything in **English** or **Hinglish** regarding construction, materials, properties, or franchise partnerships:

- 🧮 **House Construction Cost** ([Live Calculator](/calculator))
- 📦 **Wholesale Building Materials** ([Shop Now](/ShopNow))
- 🏡 **Plots & Properties** ([Explore Properties](/buy-sale))
- 💼 **Franchise Partnership** ([Franchise Portal](/franchise))
- 💬 **Direct WhatsApp Support:** [+91 94584 10866](https://wa.me/919458410866)`,
};

export default function ChatbotWidget({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Play subtle feedback chime
  const playChime = (type = 'receive') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'send') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Audio not permitted or supported
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Voice Input Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Works for Hindi, Hinglish, and Indian English

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    playChime('send');
    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      playChime('receive');

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'You can connect directly with our engineering and project advisory team on WhatsApp: [+91 94584 10866](https://wa.me/919458410866).',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Network connectivity issue. Please connect directly at [+91 94584 10866](https://wa.me/919458410866) or email mtboss2016@gmail.com.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    // Strip markdown links for clean text copy
    const cleanText = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    navigator.clipboard?.writeText(cleanText);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleResetChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([INITIAL_MESSAGE]);
    }
  };

  const renderFormatted = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-2" />;

      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2" class="underline font-bold text-sky-400 hover:text-sky-300 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
        );

      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-*]\s+/, '') }}
          />
        );
      }
      return (
        <p
          key={idx}
          className="text-xs leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  const cardBg = isDarkMode
    ? 'bg-zinc-950/95 border-zinc-800 text-white shadow-2xl'
    : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl';

  const userBubble = 'bg-gradient-to-r from-sky-500 to-[var(--brand-blue)] text-black font-semibold ml-auto shadow-md';
  const botBubble = isDarkMode
    ? 'bg-zinc-900/90 border border-zinc-800 text-zinc-100 shadow-sm'
    : 'bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-sm';

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON ── */}
      <div className="fixed bottom-6 right-24 z-[9998] flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-sky-500 via-[var(--brand-blue)] to-blue-600 text-black font-black text-xs uppercase tracking-wider rounded-full shadow-[0_10px_30px_rgba(0,180,216,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/50 group"
            aria-label="Open MTBOSS Assistant Chat"
          >
            <span className="text-base group-hover:rotate-12 transition-transform">🤖</span>
            <span className="hidden sm:inline font-bold">Ask MTBoss AI</span>

            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce shadow">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── MODERN CHAT MODAL WINDOW ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[10000] w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[88vh] rounded-3xl overflow-hidden border flex flex-col backdrop-blur-xl animate-fadeIn transition-all duration-300 shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-sky-500/30">
          <div className={`w-full h-full flex flex-col ${cardBg}`}>
            
            {/* Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-zinc-900 via-sky-950 to-zinc-900 text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-[var(--brand-blue)] text-black font-black flex items-center justify-center text-sm shadow-md">
                    MT
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-900 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black uppercase tracking-tight text-white">
                      MTBOSS AI Advisor
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Trained on All MT-Boss Services &amp; Rates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-[11px]"
                  title="Clear Chat History"
                >
                  🔄
                </button>
                <a
                  href="https://wa.me/919458410866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1"
                  title="WhatsApp Engineer"
                >
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Action Navigation Strip */}
            <div className="px-3 py-2 bg-zinc-900/60 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_ACTIONS.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qa.prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 hover:bg-sky-500 hover:text-black border border-white/10 hover:border-sky-400 transition-all text-zinc-300"
                >
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`group relative max-w-[88%] rounded-2xl p-3.5 text-xs ${
                    m.role === 'user' ? userBubble : botBubble
                  }`}
                >
                  {renderFormatted(m.content)}

                  {/* Message Action Strip */}
                  {m.role === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] text-zinc-500">MTBoss AI • Verified</span>
                      <button
                        onClick={() => handleCopy(m.content, idx)}
                        className="hover:text-sky-400 transition-colors flex items-center gap-1"
                      >
                        <span>{copiedIdx === idx ? '✓ Copied' : '📋 Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs ${botBubble} flex items-center gap-2`}>
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-zinc-400 ml-1">Consulting MT-Boss knowledge base...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Listening Bar */}
            {isListening && (
              <div className="px-4 py-2 bg-red-500/20 border-t border-red-500/30 flex items-center justify-between text-xs text-red-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Listening... Speak in Hindi or English</span>
                </div>
                <button
                  onClick={toggleVoice}
                  className="text-[10px] font-bold underline hover:text-white"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Message Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-white/10 flex items-center gap-2 bg-zinc-950/40"
            >
              <button
                type="button"
                onClick={toggleVoice}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20'
                }`}
                title="Voice Input (Speech-to-Text)"
                aria-label="Voice input"
              >
                🎙️
              </button>

              <input
                type="text"
                placeholder="Ask in English or Hinglish (e.g. 1000 sqft cost)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  isDarkMode
                    ? 'bg-zinc-900/90 border-zinc-700 text-white placeholder-zinc-500 focus:border-sky-400'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-sky-400'
                }`}
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-400 to-[var(--brand-blue)] text-black font-black flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shadow-md"
                aria-label="Send message"
              >
                ➤
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
