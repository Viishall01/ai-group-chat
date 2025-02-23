import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const Login = () => {
      const [ email, setEmail ] = useState('');
      const [ password, setPassword ] = useState('');
      const [ loading, setLoading ] = useState(false);
      const [ error, setError ] =  useState();
      
      const { setUser } = useContext(UserContext)
      const navigate = useNavigate()
  
  useEffect(()=>{
    // const isLoggedIn =JSON.parse(localStorage.getItem("token"));
      // if(isLoggedIn) navigate("/");
  },[])

  const submitHandler = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/users/login", {
        email,
        password,
      });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        // console.log("login"+JSON.stringify(res.data.user.email));
        navigate("/");
      // console.log("Login Successful:", res.data);
    } catch (err) {
      // console.error("Axios Error:", err.response ? err.response.data : err.message);
      setError(err.response.data.errors);
    }finally {
      setEmail("");  // Clear input fields no matter what
      setPassword("");
      setLoading(false);
    }
    
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">

      {/* Left Div */}
      <div className="hidden md:block bg-[#131313]" id="leftdiv">left</div>

      {/* Right Div */}
      <div className="col-span-1 bg-neutral-900 " id="rightdiv">
        <div className='justify-center'>
          <div className='mt-10 md:mt-20'>
            <h2 className="text-2xl font-semibold mb-2 text-center text-white">Log in to your account</h2>
            <p className="text-gray-400 text-center mb-6 ">Connect with :</p>
            {/* Social Login Buttons */}
          <div className="grid grid-cols-2 mb-6 px-6 md:px-40 w-full justify-center gap-2">
            <button className="flex font-semibold items-center justify-center bg-gray-300 hover:bg-gray-200 py-2 px-4 rounded-md text-neutral-900 gap-1">
              Google
            </button>
            <button className="flex font-semibold items-center justify-center bg-gray-300 hover:bg-gray-200 py-2 px-4 rounded-md text-neutral-900 gap-1">
            <FaGithub className='text-black'/>
              GitHub
            </button>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="w-[50px] md:w-[100px] border-t border-gray-400"></div>
            <span className="px-3 text-gray-300 text-sm font-semibold">LOG IN WITH EMAIL</span>
            <div className="w-[50px] md:w-[100px] border-t border-gray-400"></div>
          </div>

          </div>

          {/* Login Form */}
          <form  onSubmit={submitHandler} className='flex flex-col justify-center items-center'>
            <div className='px-6 md:px-40 w-full flex flex-col justify-center gap-2'>
              <label className="block mb-1 text-sm text-gray-400" htmlFor="email">Email</label>
              <input id='email' value={email} onChange={(e) => setEmail(e.target.value)}  type="email" className='w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none ' />
              <label className="block mb-1 text-sm text-gray-400" htmlFor="password">Password</label>
              <input id='password'value={password} onChange={(e) => setPassword(e.target.value)}  type="password" name=""className='w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none ' />
              <button disabled={loading} type='submit' className='disabled:cursor-not-allowed disabled:bg-gray-450 p-2 mt-5 bg-gray-300 rounded-md'>Log in</button>
              <span className='flex gap-1 items-center'><p className='text-white font-thin text-sm'>New to GroupChat ?</p>
              <a href="" className='text-blue-500 font-semibold'>Create an account</a></span>
              {error && <p className='text-red-600 font-bold text-sm font-mono'>{error}</p>}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
