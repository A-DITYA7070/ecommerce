import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag } from "react-icons/fa";


const user = {
    _id:"34"
}

const Header = () => {
  return <nav>
    <Link to={"/"}>Home</Link>
    <Link to={"/search"}>
       <FaSearch/>
    </Link>
    <Link to={"/cart"}>
        <FaShoppingBag/>
    </Link>
 </nav>
}

export default Header;