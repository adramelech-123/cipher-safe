import { motion } from "framer-motion";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Mail } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";
import FormInput from "@/components/FormInput";
import { UserType } from "@/types";
import { useForm } from "react-hook-form";
import { emailOnlySchema } from "@/lib/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";

const ForgotPasswordPage = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UserType>({ resolver: zodResolver(emailOnlySchema) });

    const {forgotPassword, isLoading, error} = useAuthStore()

    const submitEmail = async (data: UserType) => {
      const { email } = data;

      try {
        await forgotPassword(email);
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
    <div className="max-w-md w-full flex flex-col justify-center items-center">
      <BrandHeader
        logoSize="w-12 h-12"
        headingSize="text-4xl"
        subTextSize="text-xs mt-2"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex justify-center items-center"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form className="grid gap-4" onSubmit={handleSubmit(submitEmail)}>
              <FormInput
                inputType="email"
                iconType={Mail}
                placeHolder="Enter your email address"
                name="email"
                register={register}
                errors={errors}
              />
              {error && (
                <p className="text-red-500 font-semibold mt-1 text-center">
                  {error}
                </p>
              )}
              <Button type="submit" className="bg-violet-950 py-6">
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" size={24} />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default ForgotPasswordPage;
