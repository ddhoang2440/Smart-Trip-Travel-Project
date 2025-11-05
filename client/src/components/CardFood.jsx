import React from 'react'

const CardFood = ({number}) => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 py-[6vh]">
      {Array(number)
        .fill(1)
        .map(() => {
          return (
            <>
              <div className="card card-side bg-base-100 shadow-gray">
                  <figure className='lg:w-[16vw] w-[34vw]'>
                <img src="/bg2.jpg" alt="Food" />
              </figure>
                <div className="card-body gap-1 lg:gap-2">
                  <h2 className="card-title">Food</h2>
                  <p className='text-sm'>Rating</p>
                  <p>price</p>
                  <p>destination</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-accent text-white lg:px-8">Watch</button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
}

export default CardFood