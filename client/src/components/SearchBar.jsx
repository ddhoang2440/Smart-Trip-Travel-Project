import { IconSearch, IconX } from "@tabler/icons-react";
import React from "react";

const SearchBar = () => {
  return (
    <>
      <div>
        <label
          onClick={(e) => e.stopPropagation()}
          className="input input-xl w-[80vw] lg:w-[30vw]"
        >
          <span className="label border-r-2 border-black/50">
            <IconSearch />
          </span>
          <input type="text" placeholder="Search Something.." />
          <IconX className="p" />
        </label>
      </div>
    </>
  );
};

export default SearchBar;
