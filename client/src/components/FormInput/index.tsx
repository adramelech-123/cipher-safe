import { ComponentType } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form"; // Import from react-hook-form
import IconInput from "../IconInput";
import { Label } from "../ui/label";

interface FormInputProps {
  title?: string;
  inputType: string;
  iconType: ComponentType<{ className?: string }>;
  placeHolder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>; // Typing for `register`
  name: string; // Adding a `name` prop for form field name
  errors: FieldErrors; // Typing for `errors` from react-hook-form
}

const FormInput = ({
  title,
  inputType,
  iconType,
  placeHolder,
  register,
  name,
  errors,
}: FormInputProps) => {
  return (
    <div className="grid gap-2">
      {title && (
        <Label htmlFor={name} className="text-lg">
          {title}
        </Label>
      )}

      <IconInput
        icon={iconType}
        id={name}
        type={inputType}
        placeholder={placeHolder}
        autoComplete="off"
        {...register(name)}
      />

      {errors[name] && (
        <span className="text-sm text-red-700">
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  );
};

export default FormInput;
