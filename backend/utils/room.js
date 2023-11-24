const roomArray = [];
const membersArray = [];
const ground = [];
const addToRoom = (id, roomName) => {
 
  const idIndex = roomArray.findIndex(r=>r.id === id);
  if(idIndex === -1){
    roomArray.push({ id, roomName });
  }
 
};

const addMembersToRoom = (socketId, roomName, memberName) => {
  const isInArray = membersArray.findIndex((r) => r.room === roomName);

  if (isInArray === -1) {
    const obj = {
      room: roomName,
      members: [
        {
          name: memberName,
          id: socketId,
        },
      ],
    };
    membersArray.push(obj);
    return obj
  } else {
    membersArray.forEach((ar) => {
      if (ar.room === roomName) {
        if (ar.members.findIndex((m) => m.id === socketId) === -1) {
          ar.members = [...ar.members, { name: memberName, id: socketId }];
        }
      }
    });
    // console.log('member array',membersArray)
    return membersArray.find(ar=>ar.room === roomName)
  }

};

const getMembers = (roomName)=>{
  const room = membersArray.find((r) => r.room === roomName);
  if(!room) return null

  return room.members
}

const removeFromRoom = (id) => {
  const index = roomArray.findIndex((r) => r.id === id);
  if (index !== -1) {
    const spliced = roomArray.splice(index, 1);
    const roomName = spliced[0].roomName;
   
    membersArray.forEach((ar) => {
      if (ar.room === roomName) {
        ar.members  = ar.members.filter((m) => m.id != id);
        // ar.members = [...newArr];
        
      }
    });

    ground.forEach((ar) => {
      if (ar.room === roomName) {
        ar.members  = ar.members.filter((m) => m.id != id);
        // ar.members = [...newArr];
        
      }
    });
 
    const foundOne =  membersArray.find(ar=>ar.room === roomName);
    
    if(foundOne && foundOne.members.length === 0){
     const inde =   membersArray.findIndex(m=>m.room === foundOne.room)
     membersArray.splice(inde,1)
    }
 
    return foundOne
  }
};

const addToGround = (snap) => {
  const room = snap.room;

  const isGround = ground.findIndex((a) => a.room === room);

  if (isGround === -1) {
    ground.push(snap);
  } else {
    ground[isGround].members = snap.members;
  }
 
};

const isPlaying = (snap)=>{
    const room = snap.room;
    const isGround = ground.findIndex((a) => a.room === room);
   
    if(isGround === -1){
        return {playing:false}
    }else{
        const isGoundEmpty = ground[isGround].members.length;
        if(isGoundEmpty === 0){
            return {playing:false}
        }else{
            const players = ground[isGround].members
            return  {playing:true,players}
        }

    }
}

const removeFromGround = (id)=>{
  const index = roomArray.findIndex((r) => r.id === id);
  if (index !== -1) {
    const spliced = roomArray.splice(index, 1);
    const roomName = spliced[0].roomName;
   
    ground.forEach((ar) => {
      if (ar.room === roomName) {
        ar.members  = ar.members.filter((m) => m.id != id);
        // ar.members = [...newArr];
        
      }
    });
 
   const groundRoom =  ground.find(ar=>ar.room === roomName);
    return groundRoom

  }
}



export { addToRoom, removeFromRoom,addMembersToRoom,addToGround,isPlaying,removeFromGround,getMembers };
