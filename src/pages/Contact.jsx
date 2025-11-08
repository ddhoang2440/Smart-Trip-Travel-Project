import React from "react";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <div
        className="w-full h-screen flex flex-col items-center justify-end mb-4 "
        style={{ backgroundColor: "#F9F9F7" }}
      >
        <h1 className="text-6xl font-playfair font-bold">Contact Us</h1>
        <p className="text-gray-600/80 text-lg max-w-[30vw] text-center">
          We consider all the drives of changes give you the components you need
          to changeto create truly happens
        </p>
        <form className="flex flex-col gap-6 bg-white shadow-gray py-12 px-8 rounded-xl w-[30vw] mt-[6vh]">
          <div className="flex gap-2">
            <label className="floating-label">
              <input
                className="input input-lg "
                type="text"
                placeholder="Name"
              />
              <span className="text-xl">Name</span>
            </label>
            <div>
              <label className="floating-label">
                <input
                  className="input input-lg "
                  type="email"
                  placeholder="Email"
                />
                <span>Email</span>
              </label>
            </div>
          </div>
          <label className="floating-label">
            <input
              type="text"
              className="input input-lg border  w-full"
              placeholder="Subject"
            />
            <span>Subject</span>
          </label>
          <label className="floating-label">
            <textarea
              className="textarea textarea-lg textarea-info border border-black/20 w-full"
              placeholder="Write you message"
            ></textarea>
            <span className="text-xl">Message</span>
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
