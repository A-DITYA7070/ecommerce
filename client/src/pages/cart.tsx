import React, { useEffect, useState } from 'react';
import { VscError } from 'react-icons/vsc';
import cartItems from '../components/cartItems';


const cartItem = [];
const subtotal = 5000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const total = subtotal+tax+shippingCharges;
const discount = 400;



const Cart = () => {

  const [couponCode,setCouponCode] = useState<string>("");
  const [isValidCouponcode,setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
       if(Math.random()>0.5){
         setIsValidCouponCode(true);
       }else{
        setIsValidCouponCode(false);
       }
    },1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    }

  },[couponCode])

  return <div className='cart'>
    <main>
      {
        // cartItem.map((item,idx) => (
        //   <cartItems />
        // ))
      }

    </main>
    <aside>
      <p>Subtotal: ${subtotal} </p>
      <p>ShippingCharges : ${shippingCharges} </p>
      <p>Tax: ${tax}</p>
      <p>
        Discount - <em> ${discount}</em>
      </p>
      <p>
        <b>Total - ${total} </b>
      </p>
      <input type='text' 
      value={couponCode} 
      onChange={(e) => setCouponCode(e.target.value)} 
      placeholder="coupon code"
      />
      {
        couponCode && (
          isValidCouponcode ? 
        (  
            <span className='green'> 
                ${discount} off using the <code>{couponCode}</code>
            </span>
         ) : (
            <span className='red'> 
              Invalid coupon code <VscError/> 
            </span>
          )
        )}
    </aside>
  </div>
}

export default Cart;