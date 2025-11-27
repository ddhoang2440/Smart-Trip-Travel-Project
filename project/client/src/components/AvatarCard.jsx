import React from "react";

const AvatarCard = () => {
  return (
    <div className="overflow-x-auto scrollbar scrollbar-none h-[30vh]  flex flex-col justify-center lg:mt-[4vh]">
      <div className=" flex flex-row lg:gap-12 gap-4">
        {Array(8)
          .fill(1)
          .map((d,idx) => {
            return (
              <React.Fragment key={"avarta" + idx}>
                <div className="avatar flex flex-col items-center">
                  <div className="rounded-full lg:w-[12vw] w-[25vw] lg:h-[12vw] object-cover">
                    <img src="/pizza.jpg" />
                  </div>
                  <p className="text-black text-center mt-6 font-bold text-2xl">
                    Pizza
                  </p>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default AvatarCard;
