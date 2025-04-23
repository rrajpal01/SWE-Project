import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { set, ref as dbRef } from 'firebase/database';

const Search = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const apartmentsRef = ref(db, 'apartments');

    const unsubscribe = onValue(apartmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const apartmentArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        setApartments(apartmentArray);
      } else {
        setApartments([]);
      }
    });

    return () => unsubscribe(); // clean up on unmount
  }, []);

  const handleSave = (apartment) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to save apartments.");
      return;
    }

    const db = getDatabase();
    const savedRef = dbRef(db, `savedApartments/${user.uid}/${apartment.id}`);

    set(savedRef, apartment)
      .then(() => alert("Apartment saved to your library!"))
      .catch((error) => console.error("Save failed:", error));
  };

  return (
    <div>
      <h2>Browse Available Apartments</h2>
      {apartments.length === 0 ? (
        <p>No apartments available.</p>
      ) : (
        apartments.map((apt) => (
          <div key={apt.id} className="apartment-card">
            <h3>{apt.Description}</h3>
            <p>Rent: ${apt.costPerMonth}/mo</p>
            <p>Rental Period: {apt.rentalPeriod}</p>
            {apt.Pictures && <img src={apt.Pictures} alt="Apartment" width="150" />}
            <br />
            <button onClick={() => handleSave(apt)}>Save to Library</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Search;
