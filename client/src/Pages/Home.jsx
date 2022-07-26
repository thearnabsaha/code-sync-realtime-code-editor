import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import IMG from "../assets/code-sync.png"
import {v4 as uuidv4} from "uuid"
import {toast,Toaster} from "react-hot-toast"
import '../Styles/Home.scss'
const Home = () => {
    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate();
    const newId=()=>{
        const id = uuidv4()
        setRoomId(id)
        toast.success(`Created ROOM ID ${id}`)
    }
    const handleClick=(e)=>{
        e.preventDefault()
        if(!username || !roomId){
            toast.error("USERNAME OR ROOM ID REQUIRED!!!")
        }else{
            // Redirect
            navigate(`/room/${roomId}`, {
                state: {
                    username:username
                },
            });
        }
        
    }
  return (
    <>
        <div id="home">
            <div>
                <Toaster  position="top-right" toastOptions={{className:"toaster",sucess:{theme:{primary:"#4aee88",},},}}></Toaster>
            </div>
            <div className="box">
                <div className="imgBox">
                    <img src={IMG} alt="code sunc image" />
                </div>
                <h3>Paste Your Invitation ROOM ID</h3>
                <form>
                    <input type="text" placeholder='ROOM ID' value={roomId} onChange={(e)=>{setRoomId(e.target.value)}}/>
                    <input type="text" placeholder='USERNAME' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                    <button onClick={handleClick}>Join</button>
                </form>
                <h4>If you don't have a room then <span onClick={newId}>Create!</span></h4>
            </div>
                <h5>Built with ❤️ by <a href="https://github.com/thearnabsaha">TheArnabSaha</a></h5>
        </div>
    </>
  )
}
export default Home
