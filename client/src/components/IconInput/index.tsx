import { Input, InputProps } from "../ui/input";
import { ComponentType } from "react";

// Define the types for the props
interface IconInputProps extends InputProps {
  icon: ComponentType<{ className?: string }>;
}

const IconInput = ({icon: Icon, ...props}: IconInputProps) => {
  return (
    <div className="relative mb-2">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-slate-950" />
      </div>
      <Input {...props} className="pl-10 py-6" />
    </div>
  );
}
export default IconInput