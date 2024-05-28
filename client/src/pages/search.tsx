import { useState } from "react"
import ProductCard from "../components/productCard";

const Search = () => {

  const [search,setSearch] = useState("");
  const [sort,setSort] = useState("");
  const [maxPrice,setMaxPrice] = useState("");
  const [category,setCategory ] = useState("");
  const [page,setPage] = useState(1);

  const addToCartHandler = () => {

  }

  const isPrevPage = true;
  const isNextPage = false;

  return <div className="product-search-page">
    <aside>
      <h1>Filters</h1>
      <div>
        <h4>Sort</h4>
        <select
        value={sort}
        onChange={(e)=>setSort(e.target.value)}
        >
          <option value="">None</option>
          <option value="asc">Price (Low to High)</option>
          <option value="dsc">Price (High to Low)</option>

        </select>
      </div>

      <div>
        <h4>Max Price : {maxPrice || ""}</h4>
        <input type="range" min={100} max={100000} value={maxPrice} onChange={(e) => setMaxPrice((e.target.value))}/>
      </div>

      <div>
        <h4>Category</h4>
        <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="">Sample1</option>
          <option value="">Sample2</option>
        </select>
      </div>
    </aside>

    <main>
      <h1>Products</h1>
      <input type="text" placeholder="search by name..." value={search} 
      onChange={(e)=>setSearch(e.target.value)} />

      <div className="search-product-list">
        <ProductCard 
          productId="adhfb"
          name="macBook"
          price={2454}
          stock={2343}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/71jG+e7roXL._AC_CR0%2C0%2C0%2C0_SX750_.jpg"
        />
      </div>

      <article>
        <button disabled={!isPrevPage} onClick={() => setPage((prev)=>prev-1)}>Prev</button>
        <span>
          {page} of {4}
        </span>
        <button disabled={!isNextPage} onClick={() => setPage((next)=>next+1)}>Next</button>
      </article>
    </main>
  </div>
}

export default Search