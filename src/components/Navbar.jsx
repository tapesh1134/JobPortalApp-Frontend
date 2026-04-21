import { Link } from 'react-router-dom';
import { BookUser, Home, PlusCircle } from 'lucide-react';

const Navbar = () => (
  <nav className="bg-blue-600 text-white shadow-lg">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold flex items-center gap-2">
        <BookUser /> AddressBook
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="flex items-center gap-1 hover:text-blue-200 transition"><Home size={18}/> Home</Link>
        <Link to="/address-books" className="flex items-center gap-1 hover:text-blue-200 transition"><BookUser size={18}/> All Books</Link>
        <Link to="/add-book" className="flex items-center gap-1 hover:text-blue-200 transition"><PlusCircle size={18}/> Add Book</Link>
      </div>
    </div>
  </nav>
);
export default Navbar;