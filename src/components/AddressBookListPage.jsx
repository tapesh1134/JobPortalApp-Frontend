import React, { useEffect, useState } from 'react';
import { getAllAddressBooks } from '../api/addressBookService';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Book } from 'lucide-react';

const AddressBookListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getAllAddressBooks();
      setBooks(response.data);
    } catch (error) {
      alert("Error fetching address books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Address Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Book /></div>
              <h2 className="text-xl font-semibold">{book.name}</h2>
            </div>
            <div className="flex justify-between mt-4">
              <Link to={`/address-book/${book.id}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                <Eye size={16}/> View
              </Link>
              <button className="flex items-center gap-1 text-yellow-600 hover:underline"><Edit size={16}/> Edit</button>
              <button className="flex items-center gap-1 text-red-600 hover:underline"><Trash2 size={16}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AddressBookListPage;