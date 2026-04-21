import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addContact, updateContact, deleteContact, searchContacts } from '../api/addressBookService';
import { Plus, Mail, Phone, MapPin, Trash, Edit3 } from 'lucide-react';

const ContactListPage = () => {
  const { id } = useParams();
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', city: '', state: '', zip: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
     const res = await searchContacts();
     setContacts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateContact(id, editingId, formData);
      } else {
        await addContact(id, formData);
      }
      setShowModal(false);
      loadContacts();
      setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', city: '', state: '', zip: '' });
    } catch (err) {
      alert("Validation Error: Check your inputs");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button onClick={() => {setEditingId(null); setShowModal(true)}} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
          <Plus size={18}/> Add Contact
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4">Name</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Location</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{c.firstName} {c.lastName}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14}/> {c.email}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14}/> {c.phone}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><MapPin size={14}/> {c.city}, {c.state}</div>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => {setEditingId(c.id); setFormData(c); setShowModal(true)}} className="text-blue-600"><Edit3 size={18}/></button>
                  <button onClick={() => deleteContact(id, c.id).then(loadContacts)} className="text-red-600"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="border p-2 rounded" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
              <input placeholder="Last Name" className="border p-2 rounded" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              <input placeholder="Email" className="border p-2 rounded col-span-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <input placeholder="Phone" className="border p-2 rounded col-span-2" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required />
              <input placeholder="City" className="border p-2 rounded" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              <input placeholder="State" className="border p-2 rounded" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
              <div className="col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContactListPage;