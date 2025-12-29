import React from 'react'
import Footer from '../components/Footer';

const AboutUs = () => {
  const arr = [
    { link: "khanh.jpg", name: "Nguyễn Gia Khánh", mssv: 24127184 },
    { link: "duc1.png", name: "Nguyễn Minh Đức", mssv: 24127344 },
    { link: "hoang.jpg", name: "Đào Duy Hoàng", mssv: 24127376 },
    { link: "duy.jpg", name: "Tiêu Đại Duỹ", mssv: 24127355 },
    { link: "phu.jpg", name: "Nguyễn Văn Phú", mssv: 24127489 },
  ];
  return (
    <>
      <div className="flex flex-col pt-[20vh] pb-[30vh] px-[2vw] lg:px-[10vw] w-full h-full ">
        <div className='text-center py-[4vh] font-bold text-4xl'>Nhóm 9</div>
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-8 items-center justify-center">
          {arr.map((item, idx) => (
            <div
              key={"myteam" + idx}
              className='bg-black/80 flex flex-col gap-2 rounded-lg py-4 px-4 '
            >
              <img className="lg:w-[16vw] w-full h-[36vh] object-cover object-top hover:scale-105 transition-all duration-300" src={item.link} alt="" />
              <p className='font-semibold text-center text-white'>{item.name}</p>
              <div className='text-center text-transparent  bg-linear-to-r from-purple-500 to-pink-600 bg-clip-text'>
                {item.mssv}
              </div>
            </div>

          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs
