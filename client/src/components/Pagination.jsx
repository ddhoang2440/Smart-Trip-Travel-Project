import React from "react";

const Pagination = ({ page, totalPages, total, limit, onChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div>
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={page <= 1}
          onClick={() => page > 1 && onChange(page - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => page > 1 && onChange(page + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-xl text-gray-700">
              Showing
              <span className="font-medium"> {from} </span>
              to
              <span className="font-medium"> {to} </span>
              of
              <span className="font-medium"> {total} </span>
              results
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => page > 1 && onChange(page - 1)}
            className={`px-3 py-2 text-xl font-semibold inset-ring inset-ring-gray-300 rounded
          ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}
        `}
          >
            Prev
          </button>
          <div className="border border-gray-200 rounded-lg p-2 flex gap-2">
            {" "}
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={`relative px-4 py-2 text-xl font-semibold rounded
            ${
              page === p
                ? "bg-indigo-600 text-white inset-ring inset-ring-indigo-600"
                : "text-gray-900 bg-white inset-ring inset-ring-gray-300 hover:bg-gray-200"
            }
          `}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => page < totalPages && onChange(page + 1)}
            className={`px-3 py-2 text-xl font-semibold inset-ring inset-ring-gray-300 rounded
          ${
            page === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }
        `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
