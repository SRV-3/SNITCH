import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {useProduct} from "../../features/product/hooks/useProduct.js"

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const {handleSearchProducts} = useProduct();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center w-full md:w-auto border-b-2 border-[#eeeeee] hover:border-black focus-within:!border-black transition-colors pb-1">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH..." 
                className="bg-transparent border-none outline-none text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-black placeholder:text-[#777777] w-full md:w-32 md:focus:w-48 transition-all duration-300"
            />
            <button type="submit" className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-black ml-2 px-2 hover:text-[#777777] transition-colors">
                GO
            </button>
        </form>
    );
};

export default SearchBar;