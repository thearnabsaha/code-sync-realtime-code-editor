import React ,{useState,useEffect,useRef} from 'react'
import IMG from "../assets/code-sync.png"
import '../Styles/Room.scss'
import Avatar from 'react-avatar';
import {toast,Toaster} from "react-hot-toast"

//all code mirror imports 
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';


import { initSocket } from '../utils/socket';
import ACTIONS from '../utils/Actions';
import {Navigate, useLocation,useNavigate, useParams} from 'react-router-dom'

const Room = () => {
  const socketRef=useRef(null)
  const {roomId}=useParams()
  const [roomies, setRoomies] = useState([])
  const location=useLocation()
  const reactNavigator=useNavigate()
  if(!location.state){
    return <Navigate to="/" />
  }
  const editorRef =useRef(null)
  let code;
  useEffect(() => {
    async function init(){
      editorRef.current = Codemirror.fromTextArea(document.getElementById("realTimeEditor"),{
        mode:{name:"javascript",json:true},
        theme:"dracula",
        autoCloseTags:true,
        autoCloseBrackets:true,
        lineNumbers:true,
      })
      editorRef.current.on("change",(instance,changes)=>{
        const {origin}=changes
        code=instance.getValue()
        if(origin!=="setValue"){
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{
            roomId,
            code
          })
        }
      })
    }

    
    async function init2(){
      socketRef.current = await initSocket()
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
          console.log('socket error', e);
          toast.error('Socket connection failed, try again later.');
          reactNavigator('/'); 
      }
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username
      })
      // listening for joined event
      socketRef.current.on(ACTIONS.JOINED,(e)=>{
        toast.success(`${e.username} joined the Room!`)
        setRoomies(e.clients)
        socketRef.current.emit(ACTIONS.SYNC_CODE,{code})
      })
      
      // listening for disconneted
      socketRef.current.on(ACTIONS.DISCONNECTED,({username,socketId})=>{
          toast.success(`${username} left the Room!`)
          setRoomies((prev)=>{
            return prev.filter((e)=>e.socketId!==socketId)
          })
      })
    }
    init()
    init2()
    return()=>{
      socketRef.current.disconnect()
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)
    }
  },[])
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code!==null){
          editorRef.current.setValue(code)
        }
      })
    }

    return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
}, [socketRef.current]);

  async function copyRoomId(){
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success(" ROOM ID Copied!")
    } catch (error) {
      toast.error("could not copy Room ID!");
      console.log(error);
    }
  }
  function leaveRoom(){
    reactNavigator('/');
  }
  return (
    <>
      <div id="room">
          <div>
            <Toaster  position="top-right" toastOptions={{className:"toaster",sucess:{theme:{primary:"#4aee88",},},}}></Toaster>
          </div>
        <div className="right">
          <div className="imgBox">
            <img src={IMG} alt="" />
          </div>
          <h3>Connected</h3>
          <div className='roomies'>
            {
              roomies.map((e)=>{
                return(
                  <div key={e.socketId} className="roomBox">
                    <Avatar name={e.username} size={80} round="14px" className='avatar'/>
                    <h2>{e.username}</h2>
                  </div>
                )
              })
            }
          </div>
          <button className='copy' onClick={copyRoomId}>Copy Room Id</button>
          <button onClick={leaveRoom}>Leave</button>
        </div>
        <div className="left">
          <textarea id="realTimeEditor"></textarea>
        </div>
      </div>
    </>
  )
}
export default Room