import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { Provider } from 'react-redux';
import myStore from './Configurations/store.ts';
import SocketContextProvider from './context/socketContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={myStore}>
      <SocketContextProvider>
        <ToastContainer />
        <App />
      </SocketContextProvider>
    </Provider>
  </StrictMode>,
)