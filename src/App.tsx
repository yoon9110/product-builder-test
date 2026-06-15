import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface User {
  nickname: string;
  grade: number;
}

interface ChatRoomProps {
  grade: number;
  currentUser: User;
}

function ChatRoom({ grade, currentUser }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      text: `${grade}학년 채팅방에 오신 것을 환영합니다!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.nickname,
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  const isMyGrade = grade === currentUser.grade;

  return (
    <div className={`chat-room grade-${grade} ${!isMyGrade ? 'read-only' : ''}`}>
      <div className="chat-header">
        <h3>{grade}학년 게시판</h3>
        <span className="online-status">온라인: 1명</span>
      </div>
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.isMe ? 'me' : 'other'}`}>
            <div className="message-info">
              <span className="sender">{msg.sender}</span>
              <span className="time">{msg.timestamp}</span>
            </div>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder={isMyGrade ? "메시지를 입력하세요..." : `${grade}학년만 채팅이 가능합니다.`}
          disabled={!isMyGrade}
        />
        <button type="submit" disabled={!isMyGrade}>전송</button>
      </form>
    </div>
  );
}

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [nickname, setNickname] = useState('');
  const [grade, setGrade] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim() && grade) {
      onLogin({ nickname, grade: Number(grade) });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📚 학교 소통 공간</h1>
        <p>닉네임과 학년을 입력하고 입장하세요</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>닉네임</label>
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              placeholder="닉네임을 입력하세요"
              required 
            />
          </div>
          <div className="input-group">
            <label>학년</label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(Number(e.target.value))}
              required
            >
              <option value="">학년 선택</option>
              {[1, 2, 3, 4, 5, 6].map(g => (
                <option key={g} value={g}>{g}학년</option>
              ))}
            </select>
          </div>
          <button type="submit" className="login-button">입장하기</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-content">
          <h1>📚 {user.grade}학년 소통 공간</h1>
          <div className="user-profile">
            <span>{user.nickname}</span>
            <button onClick={() => setUser(null)} className="logout-button">로그아웃</button>
          </div>
        </div>
      </header>
      <main className="single-chat-view">
        <ChatRoom grade={user.grade} currentUser={user} />
      </main>
    </div>
  )
}

export default App
