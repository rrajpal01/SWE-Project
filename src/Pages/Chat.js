// src/components/Chat.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import './chat.css';

export default function Chat() {
  const location = useLocation();
  const { recipientId, apartmentId, apartmentName } = location.state || {};
  const [user] = useAuthState(auth);
  const dummy = useRef();

  const roomId = apartmentId || 'general';
  const messagesRef = collection(firestore, 'chats', roomId, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(q, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!recipientId && !apartmentId && !apartmentName) {
    return <div className="chat-error">Invalid chat parameters</div>;
  }

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
      <header className="chat-header">
        <h2 className="chat-title">Chat with {apartmentName || 'General Chat'}</h2>
        <p className="chat-room">Apartment ID: {roomId}</p>
      </header>

      <main className="chat-main">
        {messages?.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isSender={msg.senderId === user.uid}
          />
        ))}
        <span ref={dummy}></span>
      </main>

      <form className="chat-form" onSubmit={sendMessage}>
        <input
          className="chat-input"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          className="chat-send-button"
          type="submit"
          disabled={!formValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

function ChatMessage({ message, isSender }) {
  const { text, senderPhotoURL } = message;
  return (
    <div className={`chat-message ${isSender ? 'sent' : 'received'}`}>
      {!isSender && (
        <img
          className="chat-avatar"
          src={
            senderPhotoURL ||
            'https://api.adorable.io/avatars/23/abott@adorable.png'
          }
          alt="avatar"
        />
      )}
      <p className="chat-bubble">{text}</p>
    </div>
  );
}
