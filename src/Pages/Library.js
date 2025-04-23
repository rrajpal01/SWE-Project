import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const [savedList, setSavedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const savedRef = ref(db, `savedApartments/${user.uid}`);

    const unsubscribe = onValue(savedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const apartmentsArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        setSavedList(apartmentsArray);
      } else {
        setSavedList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMessage = (apt) => {
    // If no ownerId, use current user's ID as fallback
    const auth = getAuth();
    const ownerId = apt.ownerId || auth.currentUser.uid;
    
    // Navigate to chat screen with apartment owner
    navigate(`/chat/${apt.id}`, {
      state: {
        recipientId: ownerId,
        apartmentId: apt.id,
        apartmentName: apt.Description
      }
    });
  };

  const handleRent = (apt) => {
    const amount = apt.costPerMonth;
    // customize this to the actual Venmo username or list of recipients:
    const recipients = 'PROPERTY_OWNER_VENMO_USERNAME';
    const note = encodeURIComponent(`Rent for ${apt.Description}`);

    // deep-link into the Venmo app
    const venmoLink = `venmo://paycharge?txn=pay&recipients=${recipients}&amount=${amount}&note=${note}`;
    // fallback to the web flow if app not installed
    const webLink   = `https://venmo.com/${recipients}?txn=pay&amount=${amount}&note=${note}`;

    // try app first…
    window.location.href = venmoLink;
    // …then after a short delay fall back to web
    setTimeout(() => window.open(webLink, '_blank'), 500);
  };

  return (
    <div>
      <h2>My Saved Apartments</h2>
      {savedList.length === 0 ? (
        <p>No apartments saved yet.</p>
      ) : (
        savedList.map((apt) => (
          <div
            key={apt.id}
            className="apartment-card"
            style={{ border: '1px solid #ddd', padding: 16, marginBottom: 16 }}
          >
            <h3>{apt.Description}</h3>
            <p>Rent: ${apt.costPerMonth}/mo</p>
            <p>Rental Period: {apt.rentalPeriod}</p>
            {apt.Pictures && (
              <img
                src={apt.Pictures}
                alt="Apartment"
                width="150"
                style={{ display: 'block', marginBottom: 8 }}
              />
            )}
            <div className="apartment-actions" style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleMessage(apt)}
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                Message
              </button>
              <button
                type="button"
                onClick={() => handleRent(apt)}
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                Rent
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Library;
