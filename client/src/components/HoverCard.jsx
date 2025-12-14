import { useDispatch } from "react-redux";
import { setCurrent } from "../contexts/ResRedux";
import { useNavigate } from "react-router-dom";


const HoverCard = ({ data }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleCurrent = (_res) => {
    dispatch(setCurrent(_res))
    navigate("/restaurant")
  }
  const CreateCard = ({ card }) => {
    return (
      <div onClick={() => handleCurrent(card) } className={`p-2 rounded-lg mx-4 shadow hover:shadow-xl hover:scale-110 h-[18vh] transition-all duration-200 w-72 shrink-0 bg-cover
      hover:cursor-pointer`}
        style={{ backgroundImage: `url('${card.images?.[0] || card.image}')` }}>
        <div className="flex gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-white">{card.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pb-[2vh] bg-indigo-50/40">
      <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>

      <div className="marquee-row w-full mx-auto h-[24svh] max-w-[80vw] overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
          {data.map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
      </div>

      <div className="marquee-row w-full h-[24vh] mx-auto max-w-[80vw] overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
          {data.map((card, index) => (
            <CreateCard key={index} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default HoverCard