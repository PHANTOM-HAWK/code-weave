import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created new Room");
  };
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Room Id and UserName is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };
  const handleEnter = (e) => {
    if (e.code === "Enter") joinRoom();
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          src="/logo.jpg"
          width="100px"
          height="100px"
          alt="code-weaver-logo"
        ></img>
        <h2 className="nameOnForm">Code-Weaver</h2>
        <h3 className="tagLine">Weaving Innovation into Every Line of Code</h3>
        <h4 className="mainLabel">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleEnter}
          ></input>
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            onKeyUp={handleEnter}
          ></input>
          <button onClick={joinRoom} className="btn-join">
            Join
          </button>
          <span className="createInfo">if you want to create new Room </span>
          <a onClick={createNewRoom} href="" className="roomCreateBtn">
            click here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
