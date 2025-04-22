import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Library = () => {
  const [savedList, setSavedList] = useState([]);

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

    return () => unsubscribe(); // clean up listener
  }, []);

  return (
    <div>
      <h2>My Saved Apartments</h2>
      {savedList.length === 0 ? (
        <p>No apartments saved yet.</p>
      ) : (
        savedList.map((apt) => (
          <div key={apt.id} className="apartment-card">
            <h3>{apt.Description}</h3>
            <p>Rent: ${apt.costPerMonth}/mo</p>
            <p>Rental Period: {apt.rentalPeriod}</p>
            {apt.Pictures && <img src={apt.Pictures} alt="Apartment" width="150" />}
          </div>
        ))
      )}
    </div>
  );
};

export default Library;
