import { io } from 'socket.io-client';

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';
// const URL =  'http://localhost:5000';


 const   URL=   'http://localhost:5000'


//  const   URL =  'https://dotandsquare.onrender.com';
// console.log('react deveopment processs env', process.env.REACT_DEVELOPMENT)
// console.log('react deveopment', URL)




export const socket = io(URL);