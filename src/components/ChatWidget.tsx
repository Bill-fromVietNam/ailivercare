import React, { useRef, useState, useEffect } from 'react';

interface ChatMessage {
  id: string;
  sender: 'me' | 'bot';
  text: string;
  createdAt: number;
}

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => setOpen((v) => !v);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-me`,
      sender: 'me',
      text: trimmed,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Fake bot reply
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `${Date.now()}-bot`,
        sender: 'bot',
        text: 'Xin chào! Hiện tính năng chat đang trong giai đoạn demo.',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        aria-label="Open chat"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          border: 'none',
          background: '#1877f2',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        {open ? '×' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            right: 20,
            bottom: 84,
            width: 340,
            maxWidth: '90vw',
            height: 440,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 16px 48px rgba(0,0,0,0.24)',
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#1877f2',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 600,
            }}
          >
            Hỗ trợ
            <button
              onClick={toggleOpen}
              aria-label="Close chat"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              background: '#f5f6f7',
            }}
          >
            {messages.length === 0 && (
              <div style={{ opacity: 0.7, fontSize: 13 }}>Hãy nhập tin nhắn để bắt đầu.</div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: m.sender === 'me' ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '8px 12px',
                    borderRadius: 14,
                    background: m.sender === 'me' ? '#1877f2' : '#e4e6eb',
                    color: m.sender === 'me' ? '#fff' : '#050505',
                    fontSize: 14,
                    lineHeight: 1.35,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderTop: '1px solid #eee',
              background: '#fff',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                height: 36,
                borderRadius: 18,
                border: '1px solid #ddd',
                outline: 'none',
                padding: '0 12px',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSend}
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 18,
                border: 'none',
                background: '#1877f2',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
