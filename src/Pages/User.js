import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import swampBg from '../assets/swamp-bg.jpg';

export default function AddApartment() {
  const [username, setUsername] = useState('');
  const [desc, setDesc] = useState('');
  const [rentP, setRentP] = useState('');
  const [cost, setCost] = useState('');
  const [pics, setPics] = useState('');

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
    const newRef = push(ref(db, 'apartments'));
    set(newRef, {
      username,
      description: desc,
      rentalPeriod: rentP,
      costPerMonth: cost,
      pictures: pics,
    })
      .then(() => {
        alert('Apartment info saved!');
        setDesc('');
        setRentP('');
        setCost('');
        setPics('');
      })
      .catch(console.error);
  };

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <aside
        className="w-1/3 bg-cover bg-center p-8 text-white flex flex-col"
        style={{ backgroundImage: `url(${swampBg})` }}
      >
        <h1 className="text-4xl font-bold mb-8">SwampStays</h1>
        <nav className="flex-1">
          <ul className="space-y-4 text-lg">
            <li>Profile</li>
            <li>Home</li>
            <li>Find Sublease</li>
            <li className="underline">Add Sublease</li>
            <li>Messages</li>
          </ul>
        </nav>
      </aside>

      {/* Right form area */}
      <main className="flex-1 bg-gray-50 p-12 overflow-auto">
        <h2 className="text-5xl font-bold mb-8 text-gray-900">Add Apartment</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              required
              className="w-full border border-gray-300 rounded-lg p-4 h-32 resize-none"
              placeholder="Describe the apartment…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* Rental & Cost */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Rental Period</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="e.g. Jan – May"
                value={rentP}
                onChange={e => setRentP(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Cost per Month</label>
              <input
                type="number"
                required
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="$"
                value={cost}
                onChange={e => setCost(e.target.value)}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 mb-2">Add Images</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {pics && (
              <img
                src={pics}
                alt="Preview"
                className="mt-4 w-40 h-32 object-cover rounded-md"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-4 rounded-lg text-lg font-semibold hover:bg-gray-700"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
