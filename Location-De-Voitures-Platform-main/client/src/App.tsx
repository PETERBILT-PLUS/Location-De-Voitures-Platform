import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from "./Layout/Layout.tsx";
import Home from "./Components/Home/Home.tsx";
import RegisterAgent from "./Components/Register/RegisterAgent/RegisterAgent.tsx";
import "./App.css";
import Payment from './Components/PaymentPage/Payment.tsx';
import LoginAgent from './Components/Login/LoginAgent/LoginAgent.tsx';


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />}></Route>
      <Route path="register-agent" element={<RegisterAgent />}></Route>
      <Route path="login-agent" element={<LoginAgent />}></Route>
      <Route element={null}>
        <Route path="payment" element={<Payment />}></Route>
      </Route>
    </Route>
  ));
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;