// src/App.js
import React, { useRef, useState, useEffect } from 'react';
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
import { auth, firestore, messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

function App() {
  const [user] = useAuthState(auth);

  // Firebase Messaging Setup (generating key value pair)
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: 'BJDrhDhcT5-uah4k403xD1a33Nulbp77rDxligK60M50yJ6gViVdu1ldRyiTedF5tlfodXO22yE-04LmyYwSofY'
        }).then((currentToken) => {
          if (currentToken) {
            console.log('📬 FCM Token:', currentToken);
          } else {
            console.warn('No FCM token retrieved.');
          }
        }).catch((err) => {
          console.error('Token error:', err);
        });
      }
    });

    onMessage(messaging, (payload) => {
      console.log('🔔 Foreground message:', payload);
      alert(`📬 ${payload.notification.title}`);
    });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>messages</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

// must sign in to message
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  );
}


function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

// Actual chat room page 
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="avatar" />
      <p>{text}</p>
    </div>
  );
}

export default App;
