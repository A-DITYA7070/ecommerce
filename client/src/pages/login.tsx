import { signInWithPopup,GoogleAuthProvider } from 'firebase/auth';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import {auth} from "../firebase";
import { useLoginMutation } from '../redux/api/userAPI';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { MessageResponse } from '../types/api-types';

const Login = () => {
  const [gender,setGender] = useState("");
  const [date,setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try{
        const provider = new GoogleAuthProvider();
        const {user} = await signInWithPopup(auth,provider);

        const res = await login({
            name:"aditya",
            email:"adi@mgaj.com",
            photo:"dfgdf" || "",
            gender,
            role:"user",
            dob:date,
            _id:"dgfff"
        });

        if("data" in res){
            toast.success(res.data?.message || "logged in successfull");
        }else{
            const err = res.error as FetchBaseQueryError;
            const message = (err.data as MessageResponse).message;
            toast.error(message);
        }
    }catch(err){
        toast.error("Sign In failed");
    }
  }

  return <div className='login'>
    <main>
        <h1 className='heading'>Login</h1>
        <div>
            <label>Gender</label>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>

        <div>
            <label>DOB</label>
            <input type='date' value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>

        <div>
            <p>Already Signed In Once</p>
            <button onClick={loginHandler}>
                <FcGoogle/>
                <span>Sign In with Google</span>
            </button>
        </div>
    </main>
  </div>
}

export default Login;