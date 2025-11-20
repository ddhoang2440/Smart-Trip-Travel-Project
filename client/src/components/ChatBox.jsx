import { IconAi, IconMailAi, IconMessage, IconRobot } from '@tabler/icons-react'
import React, { useState } from 'react'

const ChatBox = () => {
    const [chat, setChat] = useState(false);
    const [question, setQuestion] = ([]);
  return (
    <>
      <div
        className="fixed right-2 bottom-13 z-50 shadow-xl animate-bounce hover:scale-110 transition-all duration-500 p bg-[#FF637D] p-4 rounded-full"
        onClick={() =>  {chat === true ? setChat(false): setChat(true)}}
      >
        <IconMessage color="white" />
      </div>
      {chat && (
        <>
          <div className="w-[90vw] lg:w-[20vw] h-[60vh] z-50 flex flex-col border border-gray-500/50   fixed bottom-32 right-4 lg:right-6 bg-slate-100 py-4 px-4 rounded-xl">
            <h1 className="text-lg flex gap-4 items-center font-semibold">
              Ask Something <IconRobot />
            </h1>
            <div className="h-[40vh] bg-white overflow-y-scroll shadow-xl  py-4 px-2 my-8">
              {Array(5)
                .fill(1)
                .map((data, key) => {
                  return (
                    <React.Fragment key={key}>
                      {" "}
                      <div className="flex-row flex gap-4 max-w-full mb-[2vh] ">
                        <IconRobot /> 
                        <div className="bg-[#FEEEB7] max-w-[74%] rounded-2xl py-2 px-4">
                          <p className="font-bold pb-1">Bot</p>
                          <p selectable className="max-w-full wrap-break-word">
                            Lorem ipsum dolor sit amet ccte weqwek
                          </p>
                          <p className="text-right text-sm">10:38AM</p>
                        </div>
                      </div>
                      <div className="flex flex-row justify-end mb-[2vh]  ">
                        <div className="bg-[#FFDCC4] flex flex-col p-4 rounded-2xl">
                          <p className="pr-[2vw]">Hellu bro!</p>
                          <div className="flex justify-end">
                            <p className="text-sm">10:38AM</p>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>
            <div className="h-[6vh]">
              <label className="input outline-0 w-full input-lg">
                <span className="label">Ask me !</span>
                <input type="text" />
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ChatBox