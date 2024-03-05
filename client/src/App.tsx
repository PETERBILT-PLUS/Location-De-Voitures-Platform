import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import './App.css';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />}></Route>
    </Route>
  ));
  return (
    <RouterProvider router={router} />
  )
}

export default App
