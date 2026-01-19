import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyB5Vp_4Vf_ORr5vtDW9ml0VSzhoMt5dqc0",
  authDomain: "ycyw-humanities-portal.firebaseapp.com",
  projectId: "ycyw-humanities-portal",
  storageBucket: "ycyw-humanities-portal.firebasestorage.app",
  messagingSenderId: "141054228326",
  appId: "1:141054228326:web:13248804cf5e407a163aa7",
  measurementId: "G-NJPT0NP98T"
};

// In a production environment, you would typically initialize Firebase here:
// import { initializeApp } from "firebase/app";
// const firebaseApp = initializeApp(firebaseConfig);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);