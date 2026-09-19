import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { askAssistant } from '../lib/api';

interface MessageMedia {
  type: 'image' | 'audio';
  url: string;
  title: string;
  alt?: string;
}

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  media?: MessageMedia[];
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

const STORAGE_KEY = 'teachai_chat_history_v1';

const SUGGESTED_PROMPTS = [
  { icon: '📚', title: 'Create a lesson plan', desc: 'For any topic or grade level' },
  { icon: '🔍', title: 'Explain this topic simply', desc: 'Make complex ideas accessible' },
  { icon: '🎯', title: 'Create a classroom activity', desc: 'Engaging and curriculum-aligned' },
  { icon: '❓', title: 'Generate quiz questions', desc: 'Multiple formats and difficulties' },
  { icon: '📊', title: 'Analyze student performance', desc: 'Get actionable insights' },
  { icon: '📝', title: 'Write learning objectives for Grade 7 Mathematics about fractions', desc: 'Clear, measurable goals' },
];

const readStoredConversations = (): Conversation[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item: Conversation) => item && typeof item.id === 'string' && Array.isArray(item.messages),
    );
  } catch {
    return [];
  }
};

const saveStoredConversations = (conversations: Conversation[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

const makeTitle = (prompt: string) => {
  const clean = prompt.replace(/\s+/g, ' ').trim();
  if (!clean) return 'New conversation';
  return clean.length > 32 ? `${clean.slice(0, 32)}...` : clean;
};

const formatConversationTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const createImageSvg = (prompt: string) => {
  const title = prompt.length > 36 ? `${prompt.slice(0, 36)}...` : prompt;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#eef2ff"/>
          <stop offset="100%" stop-color="#ede9fe"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <circle cx="980" cy="140" r="120" fill="#fbbf24" opacity="0.8"/>
      <rect x="120" y="140" width="960" height="520" rx="32" fill="#ffffff" opacity="0.7"/>
      <rect x="190" y="220" width="220" height="180" rx="20" fill="#c7d2fe"/>
      <rect x="440" y="220" width="220" height="180" rx="20" fill="#ddd6fe"/>
      <rect x="690" y="220" width="220" height="180" rx="20" fill="#bfdbfe"/>
      <circle cx="300" cy="500" r="62" fill="#34d399" opacity="0.8"/>
      <path d="M420 520 C560 360, 690 375, 830 500" stroke="#4f46e5" stroke-width="18" stroke-linecap="round" fill="none"/>
      <text x="600" y="660" text-anchor="middle" fill="#1f2937" font-family="Arial, sans-serif" font-size="42" font-weight="700">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const createAudioDataUrl = (prompt: string) => {
  const sampleRate = 22050;
  const duration = 2.7;
  const totalSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(buffer);
  const encoder = new TextEncoder();

  const writeString = (offset: number, value: string) => {
    const bytes = encoder.encode(value);
    new Uint8Array(buffer, offset, bytes.length).set(bytes);
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, totalSamples * 2, true);

  let seed = 0;
  const base = 44;

  for (let i = 0; i < totalSamples; i += 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const noise = (seed / 233280) * 2 - 1;
    const frequency = 180 + ((i % 90) * 2) + (prompt.length % 40);
    const waveValue = Math.sin((i / sampleRate) * frequency * Math.PI * 2) * 0.3 + noise * 0.14;
    const sample = Math.max(-1, Math.min(1, waveValue));
    view.setInt16(base + i * 2, sample * 32767, true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
};

const detectPromptMedia = (prompt: string): MessageMedia[] => {
  const lower = prompt.toLowerCase();
  const media: MessageMedia[] = [];

  if (/(image|illustration|diagram|poster|visual|graphic|chart|infographic|photo)/.test(lower)) {
    media.push({
      type: 'image',
      url: createImageSvg(prompt),
      title: 'Generated visual',
      alt: `Generated visual for: ${prompt}`,
    });
  }

  if (/(audio|voice|voiceover|read aloud|podcast|narration|speech|sound)/.test(lower)) {
    media.push({
      type: 'audio',
      url: createAudioDataUrl(prompt),
      title: 'Generated audio preview',
    });
  }

  return media;
};

const buildFallbackResponse = (prompt: string) => {
  const lower = prompt.toLowerCase();
  if (/(image|illustration|diagram|visual|graphic|chart|poster)/.test(lower)) {
    return `# Visual idea ready\n\n**Prompt:** ${prompt}\n\n## Suggested concept\n- Use a clean classroom-style illustration with big labels and warm colors\n- Add one main focal object and 3 supporting visual cues\n- Keep the layout simple enough for children to read in 5 seconds\n\n> This is a teacher-friendly visual concept that can be adapted for slides, handouts, or classroom walls.`;
  }

  if (/(audio|voice|narration|read aloud|speech)/.test(lower)) {
    return `# Audio idea ready\n\n**Prompt:** ${prompt}\n\n## Script outline\n1. Start with a short hook to capture attention\n2. Explain the concept in simple classroom language\n3. Give one example from everyday life\n4. End with a recap question for students\n\n> This format works well for listening stations, revision tasks, and student support.`;
  }

  return `# Teaching support\n\n**Your request:** ${prompt}\n\n## Recommended approach\n- Start with a clear learning goal\n- Make the explanation concrete and student-friendly\n- Include one practice activity and one quick check for understanding\n\n## A simple classroom flow\n1. Warm-up prompt\n2. Mini explanation\n3. Guided practice\n4. Exit question\n\n> Keep the language short, specific, and easy for learners to follow.`;
};

const humanizeResult = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return 'I could not generate a response.';
  if (Array.isArray(value)) {
    return value.map((item) => humanizeResult(item)).filter(Boolean).join('\n');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sections: string[] = [];

    if (typeof obj.title === 'string' && obj.title.trim()) sections.push(`# ${obj.title}`);
    if (typeof obj.overview === 'string' && obj.overview.trim()) sections.push(`**Overview:**\n${obj.overview}`);
    if (typeof obj.instructions === 'string' && obj.instructions.trim()) sections.push(`**Instructions:**\n${obj.instructions}`);
    if (typeof obj.response === 'string' && obj.response.trim()) return obj.response;
    if (typeof obj.summary === 'string' && obj.summary.trim()) return obj.summary;

    const listKeys = ['objectives', 'materials', 'main_activities', 'instructions'];
    for (const key of listKeys) {
      const items = obj[key];
      if (Array.isArray(items) && items.length) {
        const heading = key === 'objectives' ? '## Objectives' : key === 'materials' ? '## Materials' : key === 'main_activities' ? '## Main Activities' : '## Instructions';
        sections.push(`${heading}\n${items.map((item, index) => `- ${typeof item === 'string' ? item : `${index + 1}. ${JSON.stringify(item)}`}`).join('\n')}`);
      }
    }

    const questions = obj.questions;
    if (Array.isArray(questions) && questions.length) {
      const rows = questions.map((item, index) => {
        if (item && typeof item === 'object') {
          const q = item as Record<string, unknown>;
          const question = typeof q.question === 'string' ? q.question : '';
          const options = Array.isArray(q.options) ? q.options.join(' / ') : '';
          const answer = typeof q.correct_answer === 'string' ? q.correct_answer : '';
          return `| ${index + 1} | ${question} | ${options} | ${answer} |`;
        }
        return `| ${index + 1} | ${String(item)} | — | — |`;
      });
      sections.push(['## Questions', '| # | Question | Options | Answer |', '|---|---|---|---|', ...rows].join('\n'));
    }

    if (sections.length) return sections.join('\n\n');
    return JSON.stringify(obj, null, 2);
  }

  return String(value);
};

const renderInlineMarkdown = (value: string) => {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-indigo-700">$1</code>');
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => readStoredConversations());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    saveStoredConversations(conversations);
  }, [conversations]);

  const persistConversation = (id: string, nextMessages: Message[]) => {
    setConversations((prev) => {
      const filtered = prev.filter((conversation) => conversation.id !== id);
      const titleSource = nextMessages.find((message) => message.role === 'user')?.content ?? 'New conversation';
      const updated: Conversation = {
        id,
        title: makeTitle(titleSource),
        updatedAt: new Date().toISOString(),
        messages: nextMessages,
      };

      return [updated, ...filtered].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    });
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const conversationId = currentConversationId ?? `conv-${Date.now()}`;
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setCurrentConversationId(conversationId);
    persistConversation(conversationId, nextMessages);
    setInput('');
    setThinking(true);

    try {
      let aiContent = buildFallbackResponse(trimmed);
      let aiMedia = detectPromptMedia(trimmed);

      try {
        const response = await askAssistant({ message: trimmed });
        const backendText = response.response ?? (response.result ? humanizeResult(response.result) : undefined);
        if (backendText && backendText.trim()) aiContent = backendText;
      } catch {
        aiContent = buildFallbackResponse(trimmed);
      }

      if (!aiMedia.length && /(image|audio|visual|illustration|voice|narration|graphic|diagram|chart|photo)/.test(trimmed.toLowerCase())) {
        aiMedia = detectPromptMedia(trimmed);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiContent,
        timestamp: new Date().toISOString(),
        media: aiMedia.length ? aiMedia : undefined,
      };

      const finalMessages = [...nextMessages, aiMessage];
      setMessages(finalMessages);
      persistConversation(conversationId, finalMessages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
      const finalMessages = [...nextMessages, { id: Date.now() + 2, role: 'ai', content: errorMessage, timestamp: new Date().toISOString() }];
      setMessages(finalMessages);
      persistConversation(conversationId, finalMessages);
    } finally {
      setThinking(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setInput('');
    setThinking(false);
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    setMessages(conversation.messages);
  };

  const deleteConversation = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    const next = conversations.filter((conversation) => conversation.id !== id);
    setConversations(next);
    if (currentConversationId === id) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  const formatContent = (text: string) => {
    const lines = text.replace(/\r/g, '').split('\n');
    let html = '';
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    let listStart = 0;
    let listEnd = 0;
    let inTable = false;
    let tableRows: string[][] = [];

    const flushList = () => {
      if (!inList || !listType) return;
      const items = lines.slice(listStart, listEnd).filter(Boolean);
      const rendered = items
        .map((item) => `<li>${renderInlineMarkdown(item.replace(/^[-*]\s+|^\d+\.\s+/, ''))}</li>`)
        .join('');
      html += `<${listType}>${rendered}</${listType}>`;
      inList = false;
      listType = null;
    };

    const flushTable = () => {
      if (!inTable || tableRows.length === 0) return;
      const [header, ...rows] = tableRows;
      const head = header
        .map((cell) => `<th class="border border-slate-200 bg-slate-50 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">${renderInlineMarkdown(cell)}</th>`)
        .join('');
      const body = rows
        .map((row) => `<tr>${row.map((cell) => `<td class="border border-slate-200 px-2 py-1.5 align-top text-slate-700">${renderInlineMarkdown(cell)}</td>`).join('')}</tr>`)
        .join('');
      html += `<div class="overflow-x-auto my-3"><table class="min-w-full border-collapse text-left text-xs"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
      inTable = false;
      tableRows = [];
    };

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        flushTable();
        html += '<div class="h-2"></div>';
        continue;
      }

      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList();
        const cells = trimmed.split('|').slice(1, -1).map((cell) => cell.trim());
        if (cells.length > 1) {
          if (!inTable) {
            inTable = true;
            tableRows = [cells];
          } else {
            tableRows.push(cells);
          }
          continue;
        }
      }

      if (trimmed.startsWith('---')) {
        flushList();
        flushTable();
        html += '<hr class="my-3 border-slate-200" />';
        continue;
      }

      if (inTable && (trimmed.startsWith('|') || trimmed.startsWith('---'))) {
        continue;
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        flushTable();
        html += `<h3 class="mt-3 mb-2 text-sm font-bold text-slate-900" style="font-family: 'Plus Jakarta Sans', sans-serif;">${renderInlineMarkdown(trimmed.slice(4))}</h3>`;
        continue;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        flushTable();
        html += `<h2 class="mt-4 mb-2 text-base font-bold text-slate-900" style="font-family: 'Plus Jakarta Sans', sans-serif;">${renderInlineMarkdown(trimmed.slice(3))}</h2>`;
        continue;
      }

      if (trimmed.startsWith('# ')) {
        flushList();
        flushTable();
        html += `<h1 class="mt-3 mb-2 text-lg font-bold text-slate-900" style="font-family: 'Plus Jakarta Sans', sans-serif;">${renderInlineMarkdown(trimmed.slice(2))}</h1>`;
        continue;
      }

      if (trimmed.startsWith('> ')) {
        flushList();
        flushTable();
        html += `<div class="my-3 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-800">${renderInlineMarkdown(trimmed.slice(2))}</div>`;
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
          listStart = i;
        }
        listEnd = i + 1;
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        if (!inList || listType !== 'ol') {
          flushList();
          inList = true;
          listType = 'ol';
          listStart = i;
        }
        listEnd = i + 1;
        continue;
      }

      flushList();
      flushTable();
      html += `<p class="leading-relaxed text-slate-700">${renderInlineMarkdown(trimmed)}</p>`;
    }

    flushList();
    flushTable();
    return <div className="space-y-1 text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex h-full min-h-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className="hidden xl:flex w-64 flex-col bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <button
            type="button"
            onClick={startNewConversation}
            className="w-full btn-primary text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2 mb-2">Recent</p>
          {conversations.length === 0 && (
            <p className="px-2 py-2 text-xs text-slate-400">No saved chats yet.</p>
          )}

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group flex items-center gap-2 rounded-xl ${currentConversationId === conversation.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
            >
              <button
                type="button"
                onClick={() => selectConversation(conversation)}
                className="flex-1 text-left px-3 py-2.5 rounded-xl transition-all"
              >
                <p className={`text-sm font-medium truncate ${currentConversationId === conversation.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {conversation.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{formatConversationTime(conversation.updatedAt)}</p>
              </button>
              <button
                type="button"
                onClick={(event) => deleteConversation(event, conversation.id)}
                className="mr-2 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                aria-label={`Delete ${conversation.title}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
                <path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your AI Teaching Copilot ✨
            </h2>
            <p className="text-slate-500 text-sm mb-8 text-center max-w-md">
              Ask anything about teaching. I can create lessons, quizzes, activities, images, audio, and classroom resources.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl mb-8">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.title}
                  onClick={() => sendMessage(prompt.title)}
                  className="card-hover bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                >
                  <span className="text-2xl mb-2 block">{prompt.icon}</span>
                  <p className="text-sm font-semibold text-slate-800 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{prompt.title}</p>
                  <p className="text-xs text-slate-500">{prompt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6 space-y-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} slide-in`}>
                {message.role === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                    ✨
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl px-5 py-4 ${
                    message.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {message.role === 'ai' ? (
                    <div className="prose prose-sm text-sm space-y-1">
                      {formatContent(message.content)}
                      {message.media && message.media.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {message.media.map((item) => (
                            <div key={`${message.id}-${item.type}-${item.title}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                              {item.type === 'image' ? (
                                <img src={item.url} alt={item.alt || item.title} className="w-full max-h-72 object-cover" />
                              ) : (
                                <div className="p-3 bg-slate-900 text-white">
                                  <p className="text-[11px] uppercase tracking-wide text-slate-300 mb-2">Audio Preview</p>
                                  <audio controls src={item.url} className="w-full" />
                                </div>
                              )}
                              <p className="px-3 py-2 text-[11px] font-semibold text-slate-600">{item.title}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}

                  {message.role === 'ai' && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                      {[
                        { icon: '📋', label: 'Copy' },
                        { icon: '🔄', label: 'Regenerate' },
                        { icon: '💾', label: 'Save' },
                      ].map((action) => (
                        <button key={action.label} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-all">
                          <span>{action.icon}</span>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex gap-3 slide-in">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">✨</div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">TeachAI is preparing your response</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((dot) => (
                        <span key={dot} className="thinking-dot w-1.5 h-1.5 bg-indigo-400 rounded-full block" style={{ animationDelay: `${dot * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="flex-shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { label: 'Generate image', prompt: 'Generate an image for a Grade 7 science lesson on the water cycle' },
                { label: 'Generate audio', prompt: 'Create an audio explanation of photosynthesis for Grade 6 students' },
                { label: 'Create lesson', prompt: 'Create a detailed lesson plan for Grade 5 mathematics about fractions' },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => setInput(action.prompt)}
                  className="flex-shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-end gap-2 px-4 py-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <button className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 pb-0.5" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>

                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask anything about teaching..."
                  rows={1}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none resize-none min-h-6 max-h-24 py-0.5"
                />

                <button className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 pb-0.5" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || thinking}
                className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-2">TeachAI assists teachers — always verify AI-generated content before classroom use.</p>
        </div>
      </div>
    </div>
  );
}
