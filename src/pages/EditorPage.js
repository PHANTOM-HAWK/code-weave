import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/EditorComp";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();
        console.log("Socket initialized");

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        function handleErrors(e) {
          console.error("Socket connection error:", e);
          toast.error("Socket connection failed");
          navigate("/");
        }

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          userName: location.state?.userName,
        });

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ userName, socketId }) => {
          toast.success(`${userName} left the room`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });

        socketRef.current.on(ACTIONS.JOINED, handleJoined);
        socketRef.current.on(ACTIONS.CLIENTS_LIST, handleClientsList);
        socketRef.current.on(
          ACTIONS.EDITOR_CHANGE,
          handleEditorChangeFromServer
        );

        return () => {
          socketRef.current.off("connect_error", handleErrors);
          socketRef.current.off("connect_failed", handleErrors);
          socketRef.current.off(ACTIONS.JOINED, handleJoined);
          socketRef.current.off(ACTIONS.DISCONNECTED, handleJoined);
          socketRef.current.off(
            ACTIONS.EDITOR_CHANGE,
            handleEditorChangeFromServer
          );
          socketRef.current.disconnect();
        };
      } catch (error) {
        console.error("Error initializing socket:", error);
        toast.error("Error initializing socket");
      }
    };

    init();
  }, [navigate, roomId, location.state?.userName]);

  const handleJoined = ({ clients: newClients, userName }) => {
    if (userName !== location.state?.userName) {
      toast.success(`${userName} joined the room`);
    }
    setClients(newClients);
  };

  const handleClientsList = ({ clients: newClients }) => {
    setClients(newClients);
  };

  const handleEditorChangeFromServer = ({ value }) => {
    setCode(value);
  };

  const handleEditorChangeAndEmit = (value) => {
    setCode(value);
    socketRef.current.emit(ACTIONS.EDITOR_CHANGE, {
      roomId,
      value,
    });
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard");
  };

  const handleLeaveRoom = () => {
    navigate("/");
  };

  if (!location.state || !location.state.userName) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrapper">
      <div className="aside">
        <div className="asideInner">
          <div className="logoImageAndTagLineOnEditor">
            <img
              src="/logo.jpg"
              width="100px"
              height="100px"
              alt="code-weaver-logo"
            />
            <h2 className="nameOnEditor">Code-Weaver</h2>
            <h3 className="tagLineOnEditor">
              Weaving Innovation into Every Line of Code
            </h3>
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <button className="btn copyBtn" onClick={handleCopyRoomId}>
            Copy Room ID
          </button>
          <button className="btn leaveBtn" onClick={handleLeaveRoom}>
            Leave
          </button>
        </div>
      </div>
      <div className="editorWrap">
        <Editor onChange={handleEditorChangeAndEmit} code={code} />
      </div>
    </div>
  );
};

export default EditorPage;
