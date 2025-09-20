import { useEffect, useRef, useState } from "react";
import {io} from "socket.io-client";
import axios from "axios"
const socket=io("https://chat-5vv0.onrender.com");
export default function HomePage() {
    const [role,setRole]=useState(null);
    const [chat,setChat]=useState([]);
    const [msg,setMsg]=useState("");
    const chatEndRef=useRef(null);
    const sendMessage=async(e)=>{
       e.preventDefault();
       const msgData={
         msg:msg,
         sender:role,
         roomId:"permanentRoom"
       }
       socket.emit("sendMessage",msgData);
       setMsg("");
    }
    // make api call for chats 
    useEffect(()=>{
      async function fetchMessages () {
        const {data} = await axios.get(`https://chat-5vv0.onrender.com/msg/permanentRoom`);
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
}, [chat]);  
    if(!role){
      return(
        <>
          <div className="flex w-screen h-screen  justify-center items-center">
            <div className="flex-col w-1/3 h-1/3 bg-gray-300 rounded">
              <h2 className=" w-full h-1/4 text-center text-xl mt-4">Enter as </h2>
              <div className="flex-col justify-center items-center">
              <button className="button" onClick={()=>setRole("user")}>user</button>
              <button className="button" onClick={()=>setRole("owner")}>owner</button>
              </div>
            </div>
          </div>
        </>
      )
    }
    else {
       return (
          <div className="flex-col w-screen h-screen bg-sky-50">
             <div className="flex-col w-full h-[90%] overflow-y-auto">
                  {chat.map((e) => (    
           <div key={e._id} className={`flex ${e.sender===role?"justify-end":"justify-start"}`}>
            <div className={`flex w-1/2 ${e.sender===role?"justify-end":"justify-start"}`}>
            <p  className="bg-gray-100 mx-4 my-2 p-2 rounded-xl ">{e.content}</p></div>
            </div>
            ))}
            <div ref={chatEndRef}></div>
             </div>
              <form  className="flex w-full h-[10%]"onSubmit={sendMessage}>
             <div className="flex w-full full justify-evenly ">
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
