import React,{useEffect,useState,useRef} from 'react'
import classess from './voiceRoom.module.css';
import {useSelector} from 'react-redux';
import {Peer} from 'peerjs';
import uuid from 'react-uuid';
import {socket} from '../socket'
function VoiceRoom() {
  const room = useSelector(state=>state.user.myRoom);
  const user = useSelector(state=>state.user.userInfo);
  const [myPeer,setMyPeer] = useState()
  const [audioStream,setAudioStream] = useState();
  const [myStream,setMyStream] = useState();
  const [remoteStream,setRemoteStream] = useState();
  const [peerCollection,setPeerCollection] = useState([]);
  const audioRef = useRef()
  useEffect(()=>{
    
  
    const newId = uuid()
    const peer = new Peer(newId,{
      host:'dotandsquare.onrender.com',
      port:443,
      secure:true,
      path:'/peerjs'
    });
    // console.log('peeer', peer)
    setMyPeer(peer)
  },[])

  useEffect(()=>{
    const roomId = room?room._id :null;
    if(myPeer){
      // console.log(myPeer)
       socket.emit('peerEmit', {
      peerId : myPeer._id,
      roomId
    })
    }
    
  },[room,myPeer])

  useEffect(()=>{
    socket.on('peerRecieve', (id)=>{
       
        if(!peerCollection.includes(id)){
          const temp = [...peerCollection];
          temp.push(id);
          setPeerCollection(temp)
        }
    })
  })

  useEffect(()=>{
   try {
    const stream = navigator.mediaDevices.getUserMedia({audio: true })
    stream.then((mediaStream)=>{
      setMyStream(mediaStream)
     
    })
   } catch (error) {
    // console.log(error)
   }
  },[])

  useEffect(()=>{
    if(peerCollection.length >0 && myStream){
   const call = myPeer.call(peerCollection[peerCollection.length -1],myStream);
   
   if(call){
      call.on('stream',(rStream)=>{
        // console.log('does i recieve stream',rStream)
        setRemoteStream(rStream)
      })
   }

   myPeer.on('call',(call)=>{
      call.answer(myStream);
       call.on('stream',(rStream)=>{
        setRemoteStream(rStream)
      })
   })
    }
  },[peerCollection,myStream])
  useEffect(()=>{
    if(remoteStream){
      audioRef.current.srcObject = remoteStream;
    }
  },[remoteStream])
  return (
    <div className={classess.wrapper}>
       
      <audio controls autoplay muted={false} ref={audioRef}></audio>
    </div>
  )
}

export default VoiceRoom
