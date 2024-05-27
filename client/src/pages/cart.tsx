import { useEffect, useState } from 'react';
import { VscError } from 'react-icons/vsc';
import CartItem from '../components/cartItem';
import { Link } from 'react-router-dom';


const cartItems = [
  {
    productId:"afvgrtgRT",
    photo:"https://m.media-amazon.com/images/I/71jG+e7roXL._AC_CR0%2C0%2C0%2C0_SX750_.jpg",
    name:"Macbook",
    price:3000,
    quantity:3,
    stock:40,
  }


];
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
        cartItems.length > 0 ? cartItems.map((item,idx) => (
          <CartItem key={idx} cartItem={item}  />
        )) : <h1>No Items Added</h1>
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
        {
          cartItems.length > 0 && <Link to="/shipping">CheckOut</Link>
        }
    </aside>

    

  </div>
}

export default Cart;