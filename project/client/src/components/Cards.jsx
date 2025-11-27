import React from "react";
const Cards = () => {
  return (
    <div className="lg:flex lg:flex-row grid-cols-2 grid gap-8 h-fit py-[6vh]">
      {Array(4)
        .fill(1)
        .map(() => {
          return (
            <>
              <div className="card bg-base-100 lg:w-96  shadow-gray relative">
                <span className="absolute badge badge-lg lg:-top-6 lg:left-6 left-6 bg-red-500 border-red-500 text-white">
                  20% OFF
                </span>
                <figure className="h-[20vh]">
                  <img className="rounded-t-2xl" src="/bg1.jpg" alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Card Title</h2>
                  <p>
                    A card component has a figure, a body part, and inside body
                    there are title and actions parts
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-warning">Buy Now</button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
};

export default Cards;
