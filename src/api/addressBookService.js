import apiClient from './apiClient';

export const getAllAddressBooks = () => apiClient.get('/addressbook');
export const addAddressBook = (data) => apiClient.post('/addressbook/add', data);

export const addContact = (bookId, contactData) => 
    apiClient.post(`/addressbook/${bookId}/contacts`, contactData);

export const updateContact = (bookId, contactId, contactData) => 
    apiClient.put(`/addressbook/${bookId}/contacts/${contactId}`, contactData);

export const deleteContact = (bookId, contactId) => 
    apiClient.delete(`/addressbook/${bookId}/contacts/${contactId}`);

export const searchContacts = (state, city) => 
    apiClient.get(`/contacts/search`, { params: { state, city } });

export const getStatsByCity = () => apiClient.get('/contacts/count/city');