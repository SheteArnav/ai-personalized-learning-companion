import React, { useState, useEffect, useRef } from 'react';
import { useLearning } from '../../context/LearningContext.js';
import { api } from '../../api/client.js';
import { ChatMessage } from '../../types/index.js';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Code, 
  HelpCircle, 
  Compass, 
  Zap, 
  Copy, 
  Check, 
  User, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const AITutorView: React.FC = () => {
  const { 
    chatHistory, 
    refreshData, 
    profile, 
    startQuizForTopic, 
    prefillTutorPrompt, 
    setPrefillTutorPrompt,
    aiStatus 
  } = useLearning();

  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    if (prefillTutorPrompt) {
      setInputText(prefillTutorPrompt);
      setPrefillTutorPrompt(null);
    }
  }, [prefillTutorPrompt, setPrefillTutorPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickActions = [
    { label: 'Explain this simply', prompt: 'Explain the core intuition of Binary Search Trees in simple terms with an analogy.' },
    { label: 'Give me an example', prompt: 'Provide a production-grade code example illustrating an asynchronous worker queue.' },
    { label: 'Why am I weak at this?', prompt: 'Analyze my diagnostic quiz performance and explain why I am weak at recursion.' },
    { label: 'What should I learn next?', prompt: 'Based on my target career goal, what topic should I focus on right now?' },
    { label: 'Test my knowledge', prompt: 'Quiz me on SQL indexing, B-Trees, and database normalization.' },
  ];

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isSending) return;

    setInputText('');
    setIsSending(true);

    const tempUserMsg: ChatMessage = {
      id: `msg_tmp_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.sendMessage(text);
      setMessages((prev) => [...prev, res.assistantMessage]);
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        content: `### ⚠️ AI Engine Fallback\nI received your query: "${text}". Here is the recommended engineering breakdown for **${profile?.careerGoal || 'Software Engineer'}**.\n\nKeep focusing on core data structures and active recall questions!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearChat();
      setMessages([]);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Simple Markdown renderer helper for clean display
  const renderMessageContent = (content: string) => {
    // Split by triple backticks for code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim();
        const code = lines.slice(lang.match(/^[a-z]+$/i) ? 1 : 0).join('\n');

        return (
          <div key={idx} className="my-3 rounded-xl overflow-hidden bg-surface-400 border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-surface-300/80 border-b border-white/5 text-[11px] text-slate-400">
              <span>{lang || 'code'}</span>
              <button
                onClick={() => copyToClipboard(code, `code_${idx}`)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copiedMsgId === `code_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMsgId === `code_${idx}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format basic headers and bold markdown
      return (
        <div key={idx} className="space-y-2 leading-relaxed text-sm text-slate-200">
          {part.split('\n').map((line, lineIdx) => {
            if (line.startsWith('### ')) {
              return <h4 key={lineIdx} className="text-base font-bold text-white mt-3 mb-1">{line.slice(4)}</h4>;
            }
            if (line.startsWith('#### ')) {
              return <h5 key={lineIdx} className="text-sm font-semibold text-brand-300 mt-2 mb-1">{line.slice(5)}</h5>;
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 ml-2">
                  <span className="text-brand-400 mt-1">•</span>
                  <span>{line.slice(2)}</span>
                </div>
              );
            }
            if (line.startsWith('> ')) {
              return (
                <blockquote key={lineIdx} className="p-2.5 rounded-lg bg-surface-200/60 border-l-2 border-brand-500 text-xs text-slate-300 italic my-2">
                  {line.slice(2)}
                </blockquote>
              );
            }
            if (!line.trim()) return <div key={lineIdx} className="h-1" />;
            return <p key={lineIdx}>{line}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] glass-panel bg-surface-100/90 rounded-3xl border border-white/10 shadow-glass overflow-hidden animate-fade-in">
      {/* Top Companion Header */}
      <div className="p-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-surface-200/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow flex-shrink-0">
            <div className="w-full h-full bg-surface-400 rounded-[15px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Synapse AI Companion</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online & Context-Aware
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Specialized tutor for <strong className="text-slate-200">{profile?.careerGoal || 'Software Engineering'}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  isAI
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isAI ? <Bot className="w-4 h-4 text-brand-400" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm border shadow-sm ${
                  isAI
                    ? 'bg-surface-200/70 border-white/5 text-slate-200 max-w-2xl'
                    : 'bg-brand-600 border-brand-500 text-white max-w-xl'
                }`}
              >
                {renderMessageContent(msg.content)}

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400/80 pt-1 border-t border-white/5">
                  <span className="font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isAI && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy Response'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-xl mr-auto animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <div className="rounded-2xl p-4 bg-surface-200/70 border border-white/5 text-slate-400 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Synapse is synthesizing explanation & mental model...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Action Pills */}
      <div className="px-4 sm:px-6 py-2 border-t border-white/5 bg-surface-200/30 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Quick Prompts:
          </span>
          {quickActions.map((qa, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qa.prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-200 hover:bg-surface-300 text-slate-300 hover:text-white border border-white/10 transition-colors whitespace-nowrap"
            >
              {qa.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-4 sm:px-6 bg-surface-200/60 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Synapse anything (e.g. 'Explain B-Tree search invariant with code')..."
            className="flex-1 px-4 py-3 rounded-2xl bg-surface-300 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-glow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
