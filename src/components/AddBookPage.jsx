import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAddressBook } from '../api/addressBookService';
import { BookPlus, ArrowLeft, Loader2 } from 'lucide-react';

const AddBookPage = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const nameRegex = /^[A-Za-z]{3,20}$/;
        if (!nameRegex.test(name)) {
            setError("Name must be 3-20 characters long and contain only letters.");
            setLoading(false);
            return;
        }

        try {
            await addAddressBook({ name });
        
            alert("Address Book created successfully!");
            navigate('/address-books'); 
        } catch (err) {
            const serverMessage = err.response?.data?.message || "Failed to create Address Book. Try again.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
            >
                <ArrowLeft size={20} className="mr-1" /> Back
            </button>

            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <BookPlus className="mx-auto mb-2" size={40} />
                    <h2 className="text-2xl font-bold">Create Address Book</h2>
                    <p className="text-blue-100 text-sm">Organize your contacts in a new group</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                            Address Book Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="e.g. Work, Family, Friends"
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                                error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                            }`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                        {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                        <p className="text-gray-400 text-xs mt-2">
                            * Use 3-20 letters only.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:bg-blue-300"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Creating...
                            </>
                        ) : (
                            "Create Now"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBookPage;