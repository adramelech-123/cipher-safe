import { motion } from "framer-motion";

interface FloatingShapeProps {
    color: string,
    size: string,
    top:string ,
    left: string,
    delay: number
}

const FloatingShape = ({ color, size, top, left, delay }: FloatingShapeProps) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      style={{ top, left }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};
export default FloatingShape;
