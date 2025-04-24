import React, { useEffect, useState } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  set as firebaseSet
} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './Search.css';

export default function Search() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const apartmentsRef = ref(db, 'apartments');
    const unsubscribe = onValue(apartmentsRef, snap => {
      const data = snap.val();
      setApartments(
        data
          ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
          : []
      );
    });
    return unsubscribe;
  }, []);

  const handleSave = apt => {
    const user = getAuth().currentUser;
    if (!user) {
      return alert("You must be logged in to save apartments.");
    }
    const db = getDatabase();
    const savedRef = ref(db, `savedApartments/${user.uid}/${apt.id}`);
    firebaseSet(savedRef, apt)
      .then(() => alert("Apartment saved to your library!"))
      .catch(console.error);
  };

  const handleRent = apt => {
    const amount = apt.costPerMonth;
    const user   = (apt.venmoUsername || '').replace(/^@/, '');
    const url    = `https://venmo.com/${user}?txn=pay&amount=${amount}`;
    window.open(url, '_blank');
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2 className="search-title">Browse available apartments</h2>

        {apartments.length === 0 ? (
          <p className="no-apts">No apartments available.</p>
        ) : (
          apartments.map(apt => (
            <div key={apt.id} className="apt-card">
              <div className="apt-info">
                {/* description + rental period */}
                <div>
                  <h3>{apt.description}</h3>
                  <p className="rental-period">
                    Rental Period: {apt.rentalPeriod}
                  </p>
                </div>

                {/* rent button + favorites */}
                <div className="apt-controls">
                  <button
                    className="price-btn"
                    onClick={() => handleRent(apt)}
                  >
                    ${apt.costPerMonth}/mo
                  </button>
                  <button
                    onClick={() => handleSave(apt)}
                    className="save-btn"
                  >
                    Add to Favorites
                  </button>
                </div>
              </div>

              {/* image */}
              {apt.pictures && (
                <div className="apt-image-wrap">
                  <img
                    src={apt.pictures}
                    alt={apt.description || "Apartment"}
                    className="apt-image"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
