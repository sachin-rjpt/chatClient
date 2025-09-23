import { useEffect, useRef, useState } from "react";
import {io} from "socket.io-client";
import axios from "axios"
const server="https://chat-5vv0.onrender.com";
const socket=io(server);
import renderMessage from "../utils/renderMsg";
import renderDate from "../utils/renderDate";
import { format } from "date-fns";
export default function HomePage() {
    const [role,setRole]=useState(null);
    const [chat,setChat]=useState([]);
    const [msg,setMsg]=useState("");
    const [replyingTo,setReplyingTo]=useState(null);
    const chatEndRef=useRef(null);
    const sendMessage=async(e)=>{
       e.preventDefault();
       const msgData={
         msg:msg,
         sender:role,
         roomId:"permanentRoom",
         replyTo:replyingTo?replyingTo._id:null
       }
       socket.emit("sendMessage",msgData);
       setMsg("");
       setReplyingTo(null);
    }
    // make api call for chats 
    useEffect(()=>{
      async function fetchMessages () {
        const {data} = await axios.get(`${server}/msg/permanentRoom`);
        setChat((chat)=>[...chat,...data.allMsgs]); 
    };
    if(role){
    fetchMessages();
    }
    socket.on("receiveMessage", (data) => {
    setChat((chat) => [...chat,data]);
  });
  return () => {
    socket.off("receiveMessage");
  };
    },[role]);
   useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat,replyingTo]);  
    if(!role){
      return(
        <>
          <div className="flex w-screen h-screen  justify-center items-center bg-sky-50">
            <div className="flex-col w-1/3 h-1/3 bg-gray-100 rounded-2xl shadow-xl">
              <h2 className=" w-full h-1/4 text-center text-xl mt-4">Enter as </h2>
              <div className="flex-col w-full h-full justify-center items-center text-xl">
              <button className="bg-gray-300 scale-75 rounded p-2 w-full hover:bg-gray-400 hover:scale-100 " onClick={()=>setRole("user")}>user</button>
              <button className=" w-full scale-75 bg-green-500 p-2 rounded mt-4 hover:bg-green-600 hover:scale-100 " onClick={()=>setRole("owner")}>owner</button>
              </div>
            </div>
          </div>
        </>
      )
    }
    else {
       return (
          <div className="flex-col w-screen h-screen bg-sky-20">
             <div className="flex-col w-full h-[90%] overflow-y-auto">
                  {chat.map((e,i) => { 
                   const msgDate=new Date(e.createdAt);
                   const showDate=(i==0||(new Date(chat[i-1].createdAt).toDateString()!==msgDate.toDateString())); 
              return (
                <>
                {showDate?<div className="flex justify-center  m-4"><p className="bg-sky-50 px-2 rounded-xl">{renderDate(msgDate)}</p></div>:null}
           <div key={i} className={`flex ${e.sender===role?"justify-end":"justify-start"}`}>
            <div className={`flex w-[75%]  ${e.sender===role?"justify-end":"justify-start"}`}>
             {e.replyTo? <p className="font-serif bg-green-50 rounded-2xl p-2 opacity-75 my-2"><u>Replying To :</u> {chat.find(m=>m._id===e.replyTo)?.content||"Message"}</p>:null}
            <p onClick={()=>setReplyingTo(e)} className="bg-gray-100 mx-4 my-2 p-2 rounded-xl ">{renderMessage(e.content)}<span className="text-[8px] ml-4 rounded-xl border-1 p-1 border-green-300 ">{format(msgDate,"hh:mm a")}</span> </p></div>
            </div>
            </>
              )
        })}
            <div ref={chatEndRef}></div>
             </div>
             {replyingTo?<p className=" flex justify-between w-[75%] bg-gray-100 mx-4 my-2 p-2 rounded-xl ">{renderMessage(replyingTo.content)}<button className="text-sm" onClick={()=>setReplyingTo(null)} >&#x2715;</button> </p>:null}
              <form  className="flex w-full  h-[10%]"onSubmit={sendMessage}>
             <div className="flex w-full  justify-evenly ">
                <input className="w-[80%] h-[70%] rounded-xl ml-4 mt-4 pl-4 bg-white" type="text" placeholder="type here" value={msg} onChange={(e)=>setMsg(e.target.value)} />
                 <button
                 type="submit"
        className="px-4 bg-green-500 hover:bg-green-600 rounded-full shadow-md flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white transform -rotate-45"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
             </div>
         </form>
          </div>
       )
    }
}
