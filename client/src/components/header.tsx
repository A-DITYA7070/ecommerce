import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useState } from "react";


const user = {
    _id:"",
    role:""
}

/**
 * /header component -- includes navbar --> it renders the Header of the website..
 * It is common for all other components..
 */
const Header = () => {

  const logoutHandler = () => {
    setIsOpen(false);
  }

 const [isOpen,setIsOpen] = useState<boolean>(false);
  

  return <nav className="header">

    <Link
      onClick={() => setIsOpen(false)}
      to={"/"}
      >
        Header
     </Link>

    <Link
     to={"/search"}
     onClick={() => setIsOpen(false)}
     >
       <FaSearch/>
    </Link>

    <Link
     to={"/cart"}
     onClick={() => setIsOpen(false)}
     >
        <FaShoppingBag/>
    </Link>

    {
      user?._id ? (
      <>
        <button onClick={()=>setIsOpen((prev) => !prev)}>
          <FaUser/>
        </button>
        <dialog open={isOpen} >
          <div>
            {
              user.role === "admin" && (
                <Link to="/admin/dashboard">Admin</Link>
              )
            }
            <Link
             to="/orders"
             onClick={()=>setIsOpen(false)}
             >
               Orders
            </Link>
            <button onClick={logoutHandler}>
              <FaSignOutAlt/>
            </button>
          </div>
          
        </dialog>
      </>
      ) : ( <Link to={"/login"} onClick={()=>setIsOpen(false)}>
          <FaSignInAlt/>
      </Link>
    )}

 </nav>
}

export default Header;