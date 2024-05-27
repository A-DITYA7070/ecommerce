import React, { ChangeEvent, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {

    const [shippingInfo,setShippingInfo] = useState({
        city:"",
        address:"",
        state:"",
        country:"",
        pincode:""
    });

    const changeHandler = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo(prev=>({...prev,[e.target.name]:e.target.value}))
    };

    const navigate = useNavigate();

    return <div className='shipping'>
        <button className='back-btn' onClick={()=>navigate("/cart")}>
            <BiArrowBack/>
        </button>

        <form>
            <h1>Shipping Address</h1>

            <input type="text" placeholder='address' name='address' value={shippingInfo.address} onChange={changeHandler} required/>
            <input type="text" placeholder='city' name='city' value={shippingInfo.city} onChange={changeHandler} required/>
            <input type="text" placeholder='state' name='state' value={shippingInfo.state} onChange={changeHandler} required/>
            <input type="text" placeholder='country' name='country' value={shippingInfo.country} onChange={changeHandler} required/>
            <select name='country' required value={shippingInfo.country} onChange={changeHandler}>
                <option value="">Select Country</option>
                <option value="india">India</option>
            </select>
            <input type="number" placeholder='pincode' name='pincode' value={shippingInfo.pincode} onChange={changeHandler} required/>

            <button type='submit'>
                Pay Now
            </button>

        </form>
    </div>
}

export default Shipping;