import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const User = () => {
  const [username, setUsername] = useState('');
  const [desc, setDesc] = useState('');
  const [rentP, setRentP] = useState('');
  const [cost, setCost] = useState('');
  const [pics, setPics] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDoc = doc(db, 'users', user.uid);

      getDoc(userDoc)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            console.log('User document not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching username:', error);
        });
    } else {
      console.warn('No authenticated user.');
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPics(reader.result); // base64 image string
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const db = getDatabase();
    const apartmentsRef = ref(db, 'apartments');
    const newApartmentRef = push(apartmentsRef); // generate unique key

    set(newApartmentRef, {
      username,
      Description: desc,
      rentalPeriod: rentP,
      costPerMonth: cost,
      Pictures: pics
    })
      .then(() => {
        alert('Apartment info saved!');
        setDesc('');
        setRentP('');
        setCost('');
        setPics('');
      })
      .catch((error) => {
        console.error('Error saving to Firebase:', error);
      });
  };

  return (
    <div className="App">
      <h2>Submit Apartment Info</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          readOnly
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Rental Period (e.g., Jan - May)"
          value={rentP}
          onChange={(e) => setRentP(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cost per Month"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
        />
        {pics && <img src={pics} alt="Preview" width="150" />}
        <button type="submit">Save Apartment</button>
      </form>
    </div>
  );
};

export default User;
