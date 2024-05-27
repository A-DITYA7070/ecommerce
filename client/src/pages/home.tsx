import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"

const Home = () => {

  const addToCartHandler = () => {


  }


  return <div className = "home">
     <section></section>
     <h1>Latest Products

        <Link to="/search" className="findmore">More</Link>

     
     </h1>
     <main>
      <ProductCard 
      productId="adhfb"
      name="macBook"
      price={2454}
      stock={2343}
      handler={addToCartHandler}
      photo="https://m.media-amazon.com/images/I/71jG+e7roXL._AC_CR0%2C0%2C0%2C0_SX750_.jpg"

       />

     </main>
    </div>
    
}

export default Home