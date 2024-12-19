import { ShoppingCart, UserPlus, LogIn, Lock, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logOut } from  "../stores/userSlice";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state)=>state.user.user)
  const isAdmin = user?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //signOut API
  const handleLogout = async ()=>
  {
    try {

     await axiosInstance.post("/auth/signout",{
      withCredentials:true
     });
      dispatch(logOut());
      navigate("/")
      
    } catch (error) {
      
      toast.error("SignOut Failed While Calling API", error?.response?.data?.message || "Unexpected error occurred");
    }
  }



  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Title */}
        <div className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex">
          <Link to="/">E-Commerce</Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-4">
          {/* Home */}
          <Link
            to="/"
            className="hover:text-emerald-400 transition duration-300"
          >
            Home
          </Link>

          {/* Cart */}
          {user && (
            <div className="relative group cursor-pointer">
              <ShoppingCart
                className="inline-block mr-1 group-hover:text-emerald-400"
                size={20}
              />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                3
              </span>
            </div>
          )}

          {/* Admin Dashboard */}
          {isAdmin && (
            <Link
              to="/dashboard"
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* User Authentication */}
          {user ? (
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center gap-2 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
