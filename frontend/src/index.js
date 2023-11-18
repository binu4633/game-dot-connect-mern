import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import {store} from './redux/store';
import { GoogleOAuthProvider } from "@moeindana/google-oauth";
const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('id', process.env.NODE_ENV === "production"
? process.env.REACT_APP_GOOGLE_CLIENT_PRODUCTION
: process.env.REACT_APP_GOOGLE_CLIENT_DEVELOPMENT)
root.render(
  <React.StrictMode>
 
    <BrowserRouter>
    <GoogleOAuthProvider  clientId={ process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_GOOGLE_CLIENT_PRODUCTION
            : process.env.REACT_APP_GOOGLE_CLIENT_DEVELOPMENT}>
    <Provider store={store}>
       <App />
    </Provider>
    </GoogleOAuthProvider>
    </BrowserRouter>
 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// clientId
// 725596814658-72d3c2ba9s75aqigr3au9td650a3gfec.apps.googleusercontent.com

// client secret
// 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
