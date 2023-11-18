import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {findInvitaions,acceptInvite,declineInvite} from '../redux/userSlice';
import classess from '../css/invitaions.module.css';
import Loader from '../components/Loader';
function Invitations() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const invitaions = useSelector(state=>state.user.invitaions);
  const status = useSelector(state=>state.user.status);
  useEffect(()=>{
    dispatch(findInvitaions())
  },[])
 

  const acceptHandler = (id)=>{
     dispatch(acceptInvite({id:id}))
  }
  const declineHandler = (id)=>{
    dispatch(declineInvite({id:id}))
  }
  const backHandler = ()=>{
     navigate('/onlineRoomsGroups')
  }
  return (
    <div className={classess.wrapper}>
      {status === 'loading' && <Loader />}
      {invitaions && invitaions.length  ===0 && 
        <h4 className={classess.err}>No invitations found</h4>
      }
      {invitaions && invitaions.length >0 && invitaions.map((inv,i)=>{
         return(
          <div className={classess.card} key={i}>
             <h5 className={classess.heading}>{inv.name}</h5>
             <p className={classess.invitor}>invitor : {inv.Inviter}</p>
              <div className={classess.btn_group}>
                  <button className={classess.btn} onClick={acceptHandler.bind(this,inv.id)}>accept</button>
                  <button className={classess.btn} onClick={declineHandler.bind(this,inv.id)}>decline</button>
              </div>
         </div>
         )
      })}

           <div className={classess.back_block}>
                      <button className={classess.back_btn} onClick={backHandler}>
                          <div className={classess.arrow_block}>
                              <div className={classess.arrow1}></div>
                              <div className={classess.arrow2}></div>
                              <div className={classess.arrow3}></div>
                              <div className={classess.arrow4}></div>
                          </div>
                      </button>
                </div>
        
    </div>
  )
}

export default Invitations
