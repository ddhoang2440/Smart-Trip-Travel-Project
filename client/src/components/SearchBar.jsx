import { IconSearch, IconX } from "@tabler/icons-react";
import React from "react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <>
      {search && (
        <>
          <div
            className="fixed h-screen w-full z-150 bg-black/30 flex justify-center pt-[12vh]"
            onClick={() => setSearch(false)}
          >
            <label
              onClick={(e) => e.stopPropagation()}
              className="input input-xl input-success w-[80vw] lg:w-[30vw]"
            >
              <span className="label border-r-2 border-black/50">
                <IconSearch />
              </span>
              <input type="text" placeholder="Search Something.." />
              <IconX className="p" />
            </label>
          </div>
        </>
      )}
    </>
  );
};

export default SearchBar;
