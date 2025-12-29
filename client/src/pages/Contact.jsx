import React from "react";
import Footer from "../components/Footer";
import { IconFileDescription, IconMail, IconMessage, IconUser } from "@tabler/icons-react";
import ChatBox from "../components/ChatBox";

const Contact = () => {
  return (
    <>
      <div
        className="w-full h-screen flex flex-col items-center justify-center mb-4 "
        style={{ backgroundColor: "#F9F9F7" }}
      >
        <h1 className="text-6xl font-playfair font-bold">Contact Us</h1>
        <p className="text-gray-600/80 text-lg max-w-[80vw] lg:max-w-[30vw] text-center">
          We consider all the drives of changes give you the components you need
          to changeto create truly happens
        </p>
        <form className="flex flex-col gap-6 bg-white shadow-gray py-12 px-8 rounded-xl w-[84vw] lg:w-[30vw] mt-[6vh]">
          <div className="flex gap-2">
            <label className="floating-label">
              <input
                className="input input-lg "
                type="text"
                placeholder="Name"
              />
              <span className="text-xl flex gap-1 items-center"><IconUser />Name</span>
            </label>
            <div>
              <label className="floating-label">
                <input
                  className="input input-lg "
                  type="email"
                  placeholder="Email"
                />
                <span className="flex gap-1 items-center"><IconMail />Email</span>
              </label>
            </div>
          </div>
          <label className="floating-label">
            <input
              type="text"
              className="input input-lg border  w-full"
              placeholder="Subject"
            />
            <span className="flex gap-1 items-center"><IconFileDescription />Subject</span>
          </label>
          <label className="floating-label">
            <textarea
              className="textarea textarea-lg textarea-info border border-black/20 w-full"
              placeholder="Write you message"
            ></textarea>
            <span className="text-xl flex gap-1 items-center"><IconMessage />Message</span>
          </label>
          <button className="btn btn-error rounded-full text-white">
            Send
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
