import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import GoogleIcon from '../components/Google';
import { FaGithub } from 'react-icons/fa';
import axiosInstance from '../config/axios';

const Register = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] =  useState();

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()

    const submitHandler = async (e) => {
    
        e.preventDefault();
        if(!email || !password) setError("Proper credentials required")
        try {
        setLoading(true);
        setError("");
          const res = await axiosInstance.post("users/register", {
            email,
            password,
          });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
          setError(err.response.data.errors);
        }finally {
          setEmail("");  // Clear input fields no matter what
          setPassword("");
          setLoading(false);
        }
        
      };
    // function submitHandler(e) {

    //     e.preventDefault()

    //     axios.post('/users/register', {
    //         email,
    //         password
    //     }).then((res) => {
    //         console.log(res.data)
    //         localStorage.setItem('token', res.data.token)
    //         setUser(res.data.user)
    //         navigate('/')
    //     }).catch((err) => {
    //         console.log(err.response.data)
    //     })
    // }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen">

        {/* Left Div */}
        <div className="hidden md:block bg-[#131313]" id="leftdiv">
          <div className='flex justify-center items-center '>
          <img src='./spidy.jpg' alt='hey' className='h-full w-full mt-20'></img>
          </div>
        </div>
  
        {/* Right Div */}
        <div className="col-span-1 bg-neutral-900 " id="rightdiv">
          <div className='justify-center'>
            <div className='mt-10 md:mt-20'>
              <h2 className="text-2xl font-semibold mb-2 text-center text-white">Create your account</h2>
              <p className="text-gray-400 text-center mb-6 ">Connect GC with :</p>
              {/* Social Login Buttons */}
            <div className="grid grid-cols-2 mb-6 px-6 md:px-40 w-full justify-center gap-2">
              <button className="flex font-semibold items-center justify-center bg-gray-300 hover:bg-gray-200 py-2 px-4 rounded-md text-neutral-900 gap-1">
                <GoogleIcon />
                Google
              </button>
              <button className="flex font-semibold items-center justify-center bg-gray-300 hover:bg-gray-200 py-2 px-4 rounded-md text-neutral-900 gap-1">
              <FaGithub className='text-black h-6 w-6'/>
                GitHub
              </button>
            </div>
  
            <div className="flex items-center justify-center my-4">
              <div className="w-[50px] md:w-[100px] border-t border-gray-400"></div>
              <span className="px-3 text-gray-300 text-sm font-semibold">REGISTER WITH EMAIL</span>
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
                <button disabled={loading} type='submit' className='disabled:cursor-not-allowed disabled:bg-gray-450 p-2 mt-5 bg-gray-300 rounded-md hover:bg-white'>Sign up</button>
                <span className='flex gap-1 items-center'><p className='text-white font-thin text-sm'>Already have an account ?</p>
                <Link to="/login" className='text-blue-500 font-semibold'>Sign in</Link></span>
                {error && <p className='text-red-600 font-bold text-sm font-mono'>{error}</p>}
              </div>
            </form>
  
          </div>
        </div>
      </div>
    );
  };
export default Register