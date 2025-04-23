import React, { useRef, useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './chat.css';
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';

function Chat() {
  // 🔸 Hooks must be at top-level:
  const location = useLocation();
  const { recipientId, apartmentId, apartmentName } = location.state || {};
  const [user] = useAuthState(auth);
  const dummy = useRef();

  // build your messages query (always valid, falls back to "general")
  const roomId = apartmentId || 'general';
  const messagesRef = collection(firestore, 'chats', roomId, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  // fetch messages
  const [messages] = useCollectionData(q, { idField: 'id' });

  // form state
  const [formValue, setFormValue] = useState('');

  // auto-scroll on new messages
  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 🔸 Now that hooks have all run, handle the edge cases:
  if (!user) {
    // if logged out, redirect
    return <Navigate to="/login" replace />;
  }
  if (!recipientId && !apartmentId && !apartmentName) {
    // missing chat params
    return <div>Invalid chat parameters</div>;
  }

  // 🔸 send message handler
  const sendMessage = async (e) => {
    e.preventDefault();
    const text = formValue.trim();
    if (!text) return;

    await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      senderId: user.uid,
      recipientId: recipientId || 'general',
      senderPhotoURL: user.photoURL || null
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      <header>
        <h2>Chat with {apartmentName || 'General Chat'}</h2>
        <p>Apartment ID: {roomId}</p>
      </header>

      <main>
        {messages?.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isSender={msg.senderId === user.uid}
          />
        ))}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit" disabled={!formValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

function ChatMessage({ message, isSender }) {
  const { text, senderPhotoURL } = message;
  return (
    <div className={`message ${isSender ? 'sent' : 'received'}`}>
      {!isSender && (
        <img
          src={
            senderPhotoURL ||
            'https://api.adorable.io/avatars/23/abott@adorable.png'
          }
          alt="avatar"
        />
      )}
      <p>{text}</p>
    </div>
  );
}

export default Chat;
