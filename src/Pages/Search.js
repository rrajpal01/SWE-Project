import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set as firebaseSet } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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
          ...value,
        }));
        setApartments(apartmentArray);
      } else {
        setApartments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = (apartment) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to save apartments.");
      return;
    }

    const db = getDatabase();
    const savedRef = ref(db, `savedApartments/${user.uid}/${apartment.id}`);

    firebaseSet(savedRef, apartment)
      .then(() => alert("Apartment saved to your library!"))
      .catch((error) => console.error("Save failed:", error));
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="w-full h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('/swamp-bg.jpg')` }}
      >
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold drop-shadow-lg">Swamp Stays</h1>
          <p className="mt-2 text-lg drop-shadow-md">Find subleased apartments easily</p>
        </div>
      </div>

      {/* Apartment Listings */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">Browse Available Apartments</h2>

        {apartments.length === 0 ? (
          <p className="text-gray-500">No apartments available.</p>
        ) : (
          apartments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col md:flex-row items-start gap-6 mb-10 border-b pb-6"
            >
              <img
                src={apt.Pictures}
                alt="Apartment"
                className="w-full md:w-64 h-48 object-cover rounded-md shadow"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{apt.Description}</h3>
                <p className="text-gray-700 mt-1">
                  Rent: <strong>${apt.costPerMonth}/mo</strong>
                </p>
                <p className="text-gray-700 mb-3">
                  Rental Period: {apt.rentalPeriod}
                </p>
                <div className="flex gap-3">
                  <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                    More...
                  </button>
                  <button
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={() => handleSave(apt)}
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
