import { RouterProvider } from "react-router-dom";
import router from "./routes";
import FloatingShape from "./components/FloatingShape";

function App() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
      <RouterProvider router={router} />
      <FloatingShape
        color="bg-purple-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-purple-300"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-purple-300"
        size="w-48 h-48"
        top="10%"
        left="60%"
        delay={5}
      />
      <FloatingShape
        color="bg-purple-300"
        size="w-48 h-48"
        top="30%"
        left="50%"
        delay={5}
      />
      <FloatingShape
        color="bg-purple-300"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
    </div>
  );
}

export default App;
