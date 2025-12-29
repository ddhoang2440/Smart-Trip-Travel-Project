import React, { useState } from "react";
import Footer from "../components/Footer";
import { IconFileDescription, IconMail, IconMessage, IconUser } from "@tabler/icons-react";
import ChatBox from "../components/ChatBox";
import { useDispatch } from "react-redux";
import { contact } from "../contexts/AuthRedux";

const Contact = () => {
  const dispatch = useDispatch()
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [subject, setSubject] = useState("")
  const handleSendContact = (e) => {
    e.preventDefault();
    dispatch(contact({email, username, subject, content}))
  }
  
  return (
    <>
      <div
        className="w-full h-screen flex flex-col items-center justify-center mb-4 "
        style={{ backgroundColor: "#F9F9F7" }}
      >
        <h1 className="text-6xl font-playfair font-bold">Liên Hệ</h1>
        <p className="text-gray-600/80 text-lg max-w-[80vw] lg:max-w-[2 0vw] text-center">
          Chúng tôi xem xét tất cả đánh giá để cung cấp cho bạn các trải nghiệm
          tốt nhất
        </p>
        <form className="flex flex-col gap-6 bg-white shadow-gray py-12 px-8 rounded-xl w-[84vw] lg:w-[30vw] mt-[6vh]">
          <div className="flex gap-2">
            <label className="floating-label">
              <input
                className="input input-lg "
                type="text"
                placeholder="Tên"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="text-xl flex gap-1 items-center">
                <IconUser />
                Tên
              </span>
            </label>
            <div>
              <label className="floating-label">
                <input
                  className="input input-lg "
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="flex gap-1 items-center">
                  <IconMail />
                  Email
                </span>
              </label>
            </div>
          </div>
          <label className="floating-label">
            <input
              type="text"
              className="input input-lg border  w-full"
              placeholder="Tiêu Đề"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <span className="flex gap-1 items-center">
              <IconFileDescription />
              Tiêu Đề
            </span>
          </label>
          <label className="floating-label">
            <textarea
              className="textarea textarea-lg textarea-info border border-black/20 w-full"
              placeholder="Điều bạn muốn nói"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <span className="text-xl flex gap-1 items-center">
              <IconMessage />
              Lời Nhắn
            </span>
          </label>
          <button
            onClick={(e) => handleSendContact(e)}
            className="btn btn-error rounded-full text-white"
          >
            Send
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
