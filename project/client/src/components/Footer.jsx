import {
  IconArrowForward,
  IconBowlChopsticks,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="bg-neutral-800 text-white  px-[10vw] py-[4vh] lg:py-[10vh]">
        <div className="flex flex-col gap-4 lg:hidden mb-[4vh]">
          <div className="flex items-center gap-4 p-child">
            <IconBowlChopsticks color="orange" size={56} />
            <p className="text-xl">
              Food<span className="text-warning">Tuck</span>
            </p>
          </div>
          <div className="lg:hidden flex flex-row gap-2 px-[2vw]">
            <IconBrandInstagram />
            <IconBrandFacebook />
            <IconBrandX />
            <IconBrandLinkedin />
          </div>
        </div>
        <div className="  grid lg:grid-cols-5 grid-cols-3 gap-8 pb-[4vh] border-b border-white/50">
          <div className="lg:flex flex-col gap-4 hidden">
            <div className="flex items-center gap-4 p-child">
              <IconBowlChopsticks color="orange" size={56} />
              <p className="text-xl">
                Food<span className="text-warning">Tuck</span>
              </p>
            </div>
            <p className="lg:block hidden">
              Discover the world's most extraordinary places to stay, from
              boutique restaurant to luxury michalien star and private service.
            </p>
            <div className="flex flex-row gap-2">
              <IconBrandInstagram />
              <IconBrandFacebook />
              <IconBrandX />
              <IconBrandLinkedin />
            </div>
          </div>
          <div>
            <h1 className="font-playfair text-2xl">Team</h1>
            <ul className="space-y-4 mt-8">
              <li>
                <a className="link link-hover" href="">
                  About Us
                </a>
              </li>
              <li>
                <a className="link link-hover" href="">
                  Team
                </a>
              </li>
              <li>
                <a className="link link-hover" href="">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h1 className="font-playfair text-2xl">Company</h1>
            <ul className="space-y-4 mt-8">
              <li>
                <a className="link link-hover" href="">
                  Help And Support
                </a>
              </li>
              <li>
                <button
                  className="link link-hover"
                  // onClick={()=>setisOP}
                >
                  Partner
                </button>
              </li>
              <li>
                <a className="link link-hover" href="">
                  Ride With US
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h1 className="font-playfair text-2xl">Legal</h1>
            <ul className="space-y-4 mt-8 text-sm">
              <li>
                <a className="link link-hover" href="">
                  Term & Conditions
                </a>
              </li>
              <li>
                <a className="link link-hover" href="">
                  Refund & Cancellation
                </a>
              </li>
              <li>
                <a className="link link-hover" href="">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h1>Stay Updated</h1>
            <p className="lg:block hidden">
              Subscribe to our newsletter for travel inspiration and special
              offers.
            </p>
            <div className="text-black flex">
              <input
                type="text"
                placeholder="Your Email"
                className="input border lg:w-[10vw] w-[30vw]"
              />
              <button className="btn btn-neutral">
                <IconArrowForward />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-[4vh]">© 2025 FoodTuck. All rights reserved.</div>
        <a
          href="https://www.facebook.com/sharer/sharer.php?u=https://youtube.com"
          target="_blank"
        >
          Chia sẻ lên Facebook
        </a>
      </div>
    </>
  );
};

export default Footer;
