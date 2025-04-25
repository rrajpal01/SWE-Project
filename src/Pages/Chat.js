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
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebase';
import { getDatabase, ref as rtdbRef, get as rtdbGet } from 'firebase/database';
// import pfp from '../assets/pfp.png';    // ← import your avatar
import './chat.css';

export default function Chat({
  recipientId: propRecipientId,
  threadId:    propThreadId,
  threadName:  propThreadName
}) {
  const { state } = useLocation();
  const [user] = useAuthState(auth);

  const recipientId = propRecipientId ?? state?.recipientId;
  const roomId      = propThreadId    ?? state?.threadId;
  const threadName  = propThreadName  ?? state?.threadName;

  const [recipientName, setRecipientName] = useState('');
  const [formValue, setFormValue]         = useState('');
  const dummy                              = useRef();

  const computedRoomId = roomId || (
    user && recipientId
      ? user.uid < recipientId
        ? `${user.uid}_${recipientId}`
        : `${recipientId}_${user.uid}`
      : null
  );

  const messagesRef = computedRoomId
    ? collection(firestore, 'chats', computedRoomId, 'messages')
    : null;
  const q = computedRoomId
    ? query(messagesRef, orderBy('createdAt'), limit(25))
    : null;
  const [messages] = useCollectionData(q, { idField: 'id' });

  useEffect(() => {
    if (!recipientId) return;
    (async () => {
      try {
        const fsDoc = await getDoc(doc(firestore, 'users', recipientId));
        if (fsDoc.exists() && fsDoc.data().firstName) {
          setRecipientName(fsDoc.data().firstName);
          return;
        }
        const snap = await rtdbGet(rtdbRef(getDatabase(), `users/${recipientId}`));
        const data = snap.val();
        if (data?.firstName) {
          setRecipientName(data.firstName);
          return;
        }
        setRecipientName(threadName || recipientId);
      } catch (err) {
        console.error('Failed to load user name:', err);
        setRecipientName(threadName || recipientId);
      }
    })();
  }, [recipientId, threadName]);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user)        return <Navigate to="/login" replace />;
  if (!recipientId) return <div className="chat-error">No recipient selected.</div>;

  const sendMessage = async e => {
    e.preventDefault();
    const text = formValue.trim();
    if (!text) return;

    await addDoc(messagesRef, {
      text,
      createdAt:      serverTimestamp(),
      senderId:       user.uid,
      recipientId,
      senderPhotoURL: user.photoURL || null
    });

    await setDoc(
      doc(firestore, 'chats', computedRoomId),
      {
        participants:  [user.uid, recipientId],
        lastMessage:   text,
        lastTimestamp: serverTimestamp()
      },
      { merge: true }
    );

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2 className="chat-title">Chat with {recipientName}</h2>
      </header>

      <main className="chat-main">
        {messages?.map(msg => (
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
          onChange={e => setFormValue(e.target.value)}
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
  const { text } = message;
  return (
    <div className={`chat-message ${isSender ? 'sent' : 'received'}`}>
      {/* avatar always uses your gator_front image */}
      <p className="chat-bubble">{text}</p>
    </div>
  );
}
