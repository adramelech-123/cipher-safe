import {motion} from "framer-motion"

const PageLoadingSpinner = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-t-violet-500 border-violet-200 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
export default PageLoadingSpinner