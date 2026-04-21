import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddressBookListPage from './components/AddressBookListPage';
import ContactListPage from './components/ContactListPage';
import AddBookPage from './components/AddBookPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/address-books" element={<AddressBookListPage />} />
            <Route path="/add-book" element={<AddBookPage />} />
            <Route path="/address-book/:id" element={<ContactListPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-6 text-center text-gray-500">
          © 2024 AddressBook App - Built with Spring Boot & React
        </footer>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Manage Your Contacts Seamlessly</h1>
    <p className="text-xl text-gray-600 mb-8">Secure, organized, and accessible from anywhere.</p>
    <a href="/address-books" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700">Get Started</a>
  </div>
);

export default App;