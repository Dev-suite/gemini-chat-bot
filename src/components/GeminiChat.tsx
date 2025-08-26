import { useState, useRef, useEffect } from 'react';
import './ChatApp.css'; // Styling goes here

type Message = {
  sender: 'user' | 'gemini';
  text: string;
};

export const GeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);    

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
            })).concat([{ role: 'user', parts: [{ text: input }] }]),
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error in response';

    const geminiMessage: Message = { sender: 'gemini', text: reply };
    setMessages((prev) => [...prev, geminiMessage]);
    setLoading(false);
  };

  return (
    <div>
        <h3 className="gemini-heading">Gemini Chat bot</h3>
        <div className="chat-container">            
            <div className="chat-box">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                        <span
                        className="copy-icon"
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        title="Copy to clipboard"
                        >
                        📋
                        </span>
                    </div>
                ))}
                <div ref={chatEndRef}>{loading ? <p>Thinking...</p> : null}</div>
            </div>

            <form className="input-form" onSubmit={sendMessage}>
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                />
                <button type="submit" disabled={loading}>
                {loading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    </div>
    
  );
};
