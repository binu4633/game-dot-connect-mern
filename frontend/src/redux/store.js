import {configureStore} from '@reduxjs/toolkit';
import practiseGameReducer from './practiceGameReducer';
import cpuGameReducer from './cpuGameReducer';
import onlineGameReducer from './onlineGameReducer'
import userReducer from './userSlice';
export const store = configureStore({
    reducer:{
      practiseGameStore:practiseGameReducer,
      cpuGameStore:cpuGameReducer,
      onlineGameStore:onlineGameReducer,
      user:userReducer
    }
})
