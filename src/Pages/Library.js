// Library.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Library.css';

const Library = () => {
  const [savedList, setSavedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;
    const savedRef = ref(getDatabase(), `savedApartments/${user.uid}`);
    const unsubscribe = onValue(savedRef, snap => {
      const data = snap.val() || {};
      setSavedList(
        Object.entries(data).map(([id, val]) => ({ id, ...val }))
      );
    });
    return unsubscribe;
  }, []);

  const handleMessage = (apt) => {
    // this is your “targetUserUid”
    const targetUserUid = apt.ownerId
  
    navigate(`/chat/${apt.id}`, {
      state: {
        recipientId:   targetUserUid,
        apartmentId:   apt.id,
        apartmentName: apt.description,
      }
    })
  }
  

  const handleRent = apt => {
    const amount = apt.costPerMonth;
    let user = (apt.venmoUsername || '').replace(/^@/, '');
    const webUrl   = `https://venmo.com/${user}?txn=pay&amount=${amount}`;
    window.open(webUrl, '_blank');
    
  };

  return (
    <div className="library-container">
      <h2 className="library-title">My Saved Apartments</h2>
      {savedList.length === 0 ? (
        <p>No apartments saved yet.</p>
      ) : savedList.map(apt => (
        <div className="apartment-card" key={apt.id}>
          <div
            className="apartment-image"
            style={{ backgroundImage: `url(${apt.pictures})` }}
          />
          <div className="apartment-info">
            {/* Make sure your Firebase field is named “Description” (capital “D”) */}
            <h3>{apt.description}</h3>
            <p><strong>Rent:</strong> ${apt.costPerMonth}</p>
            <div className="apartment-actions">
              <button className="rent-btn"    onClick={() => handleRent(apt)}>
                Rent
              </button>
              <button className="message-btn" onClick={() => handleMessage(apt)}>
                Message
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Library;
