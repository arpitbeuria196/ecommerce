import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { setUser,setLoading,setError } from "../stores/userSlice";




const LoginPage = () => {

  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("")

  //login API Call

  const loginUser = async(email,password)=>
  {
    try {
      const response = await axiosInstance.post("/auth/signin",{
        email,
        password
      });
      return response.data;
      
    } catch (error) {
      
      toast.error("SignIn Failed While Calling API", error?.response?.data?.message || "Unexpected error occurred");

    }
  }

  const handleSubmit = async (e)=>
  {
    e.preventDefault();
    if (!email.includes("@")) {
      return toast.error("Please enter a valid email address");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    
    dispatch(setLoading(true));
    try {
     const user = await loginUser(email,password);
     dispatch(setUser(user))
     toast.success("SignIn Successfully Done!!");
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "SignIn failed"));
      toast.error(error.response?.data?.message || "SignIn failed");
    }
    finally
    {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Sign in to your account</h2>
			</motion.div>
      <motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
      <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
        <form onSubmit={handleSubmit} className='space-y-6'>

          <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
          Email address
          </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
              placeholder="you@example.com"
              value={email}
              id="email"
              type="email"
              required
              className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
									 focus:border-emerald-500 sm:text-sm'
              onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>

          <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
								Password
					</label>
          <div className='mt-1 relative rounded-md shadow-sm'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
					</div>
            <input
            placeholder="******"
            className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type="password"
            id="password"
            required
            />
          </div>

    </div>
    <button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>

        </form>
      </div>

            <p className='mt-8 text-center text-sm text-gray-400'>
              Not a member?{" "}
              <Link to = '/signup' className="font-medium text-emerald-400 hover:text-emerald-300">
                    Sign up now <ArrowRight className='inline h-4 w-4' />
              </Link>
            </p>
      </motion.div>

    </div>
  );
};

export default LoginPage;
