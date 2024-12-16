import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<HomePage/>
    },
    {
      path:"/signup",
      element:<SignUpPage/>
    },
    {
      path:"/login",
      element:<LoginPage/>
    }
  ])

  return(
    
    
    <div>
      <RouterProvider router={router}/>
    </div>
  );

}

export default App;