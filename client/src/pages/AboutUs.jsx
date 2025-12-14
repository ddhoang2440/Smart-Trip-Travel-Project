import React from "react";
import Footer from "../components//Footer";
import Title from "../components/Title";
import {
  IconBoxMultiple,
  IconClockUp,
  IconTableShortcut,
} from "@tabler/icons-react";
import { useEffect } from "react";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="py-[6vh]">
        <div className="flex flex-col lg:flex-row px-[10vw] gap-6 h-screen items-center">
          <img
            src="/bg2.jpg"
            alt=""
            className="w-full lg:w-[30vw] h-[40vh] lg:h-[65vh] object-cover rounded-2xl"
          />
          <div className="flex-1 flex flex-col gap-5 items-center lg:justify-center justify-start">
            <Title
              Title="We provide healthy food for your family."
              Decription="Our story began with a vision to create a unique dining experience
              that merges fine dining, exceptional service, and a vibrant
              ambiance. Rooted in city's rich culinary culture, we aim to honor
              our local roots while infusing a global palate."
              align="left"
            ></Title>
            <p className="text-sm text-gray-600/80 ">
              At place, we believe that dining is not just about food, but also
              about the overall experience. Our staff, renowned for their warmth
              and dedication, strives to make every visit an unforgettable
              event.
            </p>
          </div>
        </div>
        <div className="px-[14vw] h-screen bg-[url(/bg2.jpg)] bg-no-repeat flex flex-col items-center justify-center gap-[8vh]">
          <h2 className="text-white lg:text-4xl text-2xl font-bold text-center lg:max-w-[26vw] ">
            Feel the authentic & original taste from us
          </h2>
          <div className="lg:flex grid grid-cols-2 flex-row gap-8 py-10">
            <div className="flex gap-2 items-center">
              <IconBoxMultiple color="white" size="50" />
              <div className="flex flex-col gap-4">
                <b className=" text-white text-base lg:text-lg ">
                  Multi Cuisine
                </b>
                <p className="lg:max-w-[28vw] lg:max-h-[8vh] max-h-[15vh] max-w-[30vw] text-left text-white text-sm lg:text-base">
                  In the new era of technology we look in the future with
                  certainty life.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IconTableShortcut color="white" size="50" />
              <div className="flex flex-col gap-4">
                <b className=" text-white text-base lg:text-lg text-left">
                  Easy To Order
                </b>
                <p className="lg:max-w-[28vw] lg:max-h-[8vh] max-h-[15vh] max-w-[30vw] text-left text-white text-sm lg:text-base">
                  In the new era of technology we look in the future with
                  certainty life.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center lg:mt-0 mt-10">
              <IconClockUp color="white" size="50" />
              <div className="flex flex-col gap-4">
                <b className=" text-white text-base lg:text-lg text-left">
                  Fast Delivery
                </b>
                <p className="lg:max-w-[28vw] lg:max-h-[8vh] max-h-[15vh] max-w-[30vw] text-left text-white text-sm lg:text-base">
                  In the new era of technology we look in the future with
                  certainty life.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" pt-[15vh] px-[18vw]">
          <h2 className="text-4xl pb-[10vh] text-center">
            What Our Customers Say
          </h2>
          <div className="flex lg:flex-row flex-col justify-center items-center gap-10">
            {Array(3)
              .fill(1)
              .map((d, idx) => {
                return (
                  <React.Fragment key={"comment" + idx}>
                    <div className="flex flex-col shadow-2xl rounded-2xl bg-gray-200/80 p-4">
                      <h3 className="text-red-500/80 text-lg">
                        “The best restaurant”
                      </h3>
                      <p className="text-gray-600 ">
                        Last night, we dined at place and were simply blown
                        away. From the moment we stepped in, we were enveloped
                        in an inviting atmosphere and greeted with warm smiles.
                      </p>
                      <div className="flex items-center gap-4 pt-3">
                        <img
                          src="./pizza.jpg"
                          alt=""
                          className="rounded-full size-[3vw]"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            Nguyen Gia Khanh
                          </span>
                          <span className="text-sm text-gray-700">
                            135B Tran Hung Dao
                          </span>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
