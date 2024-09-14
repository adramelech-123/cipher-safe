import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App() {
  return (
    <div className="min-h-screen text-white bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
