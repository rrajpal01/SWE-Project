import React, { useState, useEffect } from 'react';
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  update
} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './UserListings.css';

export default function YourListings() {
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    venmoUsername: '',
    rentalPeriod: '',
    costPerMonth: '',
    pictures: ''
  });

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const db = getDatabase();
    const listingsQuery = query(
      ref(db, 'apartments'),
      orderByChild('ownerId'),
      equalTo(user.uid)
    );

    const unsubscribe = onValue(listingsQuery, snapshot => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, apt]) => ({ id, ...apt }));
      setListings(arr);
    });

    return () => unsubscribe();
  }, [user]);

  function startEdit(apt) {
    setEditingId(apt.id);
    setFormData({
      description: apt.description || '',
      venmoUsername: apt.venmoUsername || '',
      rentalPeriod: apt.rentalPeriod || '',
      costPerMonth: apt.costPerMonth || '',
      pictures: apt.pictures || ''
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData(fd => ({ ...fd, pictures: reader.result }));
    reader.readAsDataURL(file);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  }

  async function saveEdit(e) {
    e.preventDefault();
    const db = getDatabase();
    const aptRef = ref(db, `apartments/${editingId}`);
    await update(aptRef, {
      description: formData.description,
      venmoUsername: formData.venmoUsername,
      rentalPeriod: formData.rentalPeriod,
      costPerMonth: formData.costPerMonth,
      pictures: formData.pictures
    });
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  if (!user) return <p>Please log in to see your listings.</p>;

  return (
    <div className="your-listings-page">
      <h1 className="listings-title">Your Listings</h1>
      <ul>
        {listings.map(apt => (
          <li key={apt.id} className="listing-card">
            <div
              className="listing-image"
              style={{ backgroundImage: `url(${apt.pictures})` }}
            />

            <div className="listing-details">
              {editingId === apt.id ? (
                <form onSubmit={saveEdit} style={{ width: '100%' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>
                      Description
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                      />
                    </label>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label>
                      Venmo Username
                      <input
                        name="venmoUsername"
                        value={formData.venmoUsername}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ flex: 1 }}>
                      Rental Period
                      <input
                        name="rentalPeriod"
                        value={formData.rentalPeriod}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                      />
                    </label>
                    <label style={{ flex: 1 }}>
                      Cost per Month
                      <input
                        name="costPerMonth"
                        type="number"
                        value={formData.costPerMonth}
                        onChange={handleChange}
                        required
                        style={{ width: '100%' }}
                      />
                    </label>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label>
                      Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="listing-buttons">
                    <button type="submit" className="btn-edit">Save</button>
                    <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="listing-info">
                    <h2>{apt.description}</h2>
                    <p>{apt.rentalPeriod} • ${apt.costPerMonth}/mo</p>
                  </div>
                  <div className="listing-buttons">
                    <button className="btn-edit" onClick={() => startEdit(apt)}>Edit</button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
