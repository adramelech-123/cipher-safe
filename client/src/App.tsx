import { RouterProvider } from "react-router-dom";
import router from "./routes";
import FloatingShapesBG from "./components/FloatingShapesBG";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
      <RouterProvider router={router} />
      <FloatingShapesBG/>
      <Toaster/>
    </div>
  );
}

export default App;
