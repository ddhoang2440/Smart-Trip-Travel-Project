import { IconSearch, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const initialState = {
    keyword: "",
    user_lat: "",
    user_lng: "",
  };
  const [formInput, setFormInput] = useState(initialState);
  const handleSearch = () => {
    const query = new URLSearchParams(formInput).toString();
    navigate(`/product?${query}`);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]:
        name === "user_lat" || name === "user_lng" ? Number(value) : value,
    }));
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="flex gap-2 items-center">
        <label
          onClick={(e) => e.stopPropagation()}
          className="input input-xl w-[80vw] lg:w-[30vw] outline-0 rounded-xl"
        >
          <span className="label ">
            <IconSearch />
          </span>
          <input
            name="keyword"
            type="text"
            placeholder="Search Something.."
            onChange={handleChange}
          />
          <IconX className="p" />
        </label>
        <button
          onClick={handleSearch}
          className="flex bg-black text-white p-4 rounded-2xl hover:bg-gray-900 hover:scale-95"
        >
          <IconSearch />
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBar;
