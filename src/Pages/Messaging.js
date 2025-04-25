import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import Chat from './Chat';
import './messaging.css';

export default function Messaging() {
  const [user] = useAuthState(auth);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    async function fetchThreads() {
      try {
        const q = query(
          collection(firestore, 'chats'),
          where('participants', 'array-contains', user.uid),
          orderBy('lastTimestamp', 'desc')
        );
        let snap = await getDocs(q);
        if (snap.empty) {
          snap = await getDocs(
            query(
              collection(firestore, 'chats'),
              where('participants', 'array-contains', user.uid)
            )
          );
        }
        const data = await Promise.all(
          snap.docs.map(async (d) => {
            const { participants, lastMessage, lastTimestamp } = d.data();
            const otherUid = participants.find((u) => u !== user.uid);
            
            console.log('Looking up user with UID:', otherUid);
            
            let name = null;
            
            try {
              // 1) try Firestore
              const userRef = doc(firestore, 'users', otherUid);
              const docSnap = await getDoc(userRef);
              
              if (docSnap.exists() && docSnap.data().firstName) {
                name = docSnap.data().firstName;
                console.log('Using Firestore firstName:', name);
              } else {
                // 2) fallback to Realtime DB
                const db = getDatabase();
                const rtdbRef = ref(db, `users/${otherUid}`);
                const snap = await get(rtdbRef);
                const data = snap.val();
                
                if (data?.firstName) {
                  name = data.firstName;
                  console.log('Using RTDB firstName:', name);
                } else {
                  // 3) final fallback
                  name = otherUid ? `User ${otherUid.slice(0, 6)}...` : 'Unknown User';
                  console.log('Using fallback name:', name);
                }
              }
            } catch (e) {
              console.error('Error fetching user data for UID', otherUid, ':', e);
              name = otherUid ? `User ${otherUid.slice(0, 6)}...` : 'Unknown User';
            }
            
            return {
              threadId: d.id,
              otherUid,
              name,
              lastMessage,
              lastTimestamp: lastTimestamp?.toDate() || null,
            };
          })
        );
        console.log('Processed threads:', data);
        setThreads(data);
        setActiveThread((prev) => prev || data[0] || null);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to load threads.');
      }
    }
    fetchThreads();
  }, [user]);

  // Log activeThread when it changes
  useEffect(() => {
    console.log('Active thread changed:', activeThread);
  }, [activeThread]);

  if (!user) return <div className="empty-chat">Please log in to see messages.</div>;
  if (error) return <div className="empty-chat">{error}</div>;

  return (
    <div className="messaging-container">
      <aside className="conversations-list">
        {threads.length > 0 ? (
          threads.map((t) => (
            <div
              key={t.threadId}
              className={`conversation-item ${t.threadId === activeThread?.threadId ? 'active' : ''}`}
              onClick={() => setActiveThread(t)}
            >
              <div className="conversation-avatar">{t.name?.[0]?.toUpperCase() || '?'}</div>
              <div className="conversation-info">
                <p className="conversation-name">{t.name}</p>
                {t.lastMessage && <p className="conversation-snippet">{t.lastMessage}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-conversation-list">No conversations yet</div>
        )}
      </aside>
      {activeThread ? (
        <Chat
          recipientId={activeThread.otherUid}
          threadId={activeThread.threadId}
          threadName={activeThread.name}
        />
      ) : (
        <div className="empty-chat">Select a conversation</div>
      )}
    </div>
  );
}