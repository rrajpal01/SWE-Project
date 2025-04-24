import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import './User.css';
export default function AddApartment() {
  const [username, setUsername] = useState('');
  const [desc, setDesc] = useState('');
  const [venmo, setVenmo] = useState('');
  const [period, setPeriod] = useState('');
  const [cost, setCost] = useState('');
  const [pics, setPics] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    getDoc(doc(db, 'users', user.uid))
      .then(docSnap => {
        if (docSnap.exists()) setUsername(docSnap.data().username);
      })
      .catch(console.error);
  }, []);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPics(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const db = getDatabase();
    const auth = getAuth();
    if (!auth.currentUser) return alert('Please Log in First.');
    const newRef = push(ref(db, 'apartments'));
    set(newRef, {
      ownerId:       auth.currentUser.uid,
      username,
      description: desc,
      venmoUsername: venmo,
      rentalPeriod: period,
      costPerMonth: cost,
      pictures: pics,
    })
      .then(() => {
        alert('Apartment info saved!');
        setDesc('');
        setVenmo('');
        setPeriod('');
        setCost('');
        setPics('');
        navigate('/find');
      })
      .catch(console.error);
  };

  return (
    <div className="add-apt-page">
      <form className="add-apt-form" onSubmit={handleSubmit}>
        <h1 className="add-apt-title">Add Apartment</h1>

        <fieldset className="add-apt-field">
          <legend>Description</legend>
          <textarea
            required
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe the apartment…"
          />
        </fieldset>

        <div className="add-apt-row">
          <fieldset className="add-apt-field small">
            <legend>Venmo Username</legend>
            <input
              required
              type="text"
              value={venmo}
              onChange={e => setVenmo(e.target.value)}
              placeholder="@username"
            />
          </fieldset>
          <fieldset className="add-apt-field small">
            <legend>Rental Period</legend>
            <input
              required
              type="text"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              placeholder="e.g. Jan–May"
            />
          </fieldset>
          <fieldset className="add-apt-field small">
            <legend>Cost per Month</legend>
            <input
              required
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="$"
            />
          </fieldset>
        </div>

        <fieldset className="add-apt-field">
          <legend>Add Images</legend>
          <label className="add-apt-dropzone">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {pics
              ? <img src={pics} alt="preview" className="preview"/>
              : <span>Click or drag to upload</span>
            }
          </label>
        </fieldset>

        <button type="submit" className="add-apt-submit">
          Submit
        </button>
      </form>
    </div>
  );
}
