// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AvatarDropdown from "./AvatarDropdown";

const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        SpellingApp
      </Link>

      {!loading && (
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/sign-in" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <AvatarDropdown />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
