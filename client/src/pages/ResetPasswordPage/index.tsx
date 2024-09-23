import { motion } from "framer-motion";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";
import FormInput from "@/components/FormInput";
import { useForm } from "react-hook-form";
import { UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/formValidation";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UserType>({ resolver: zodResolver(resetPasswordSchema) });

    const { token } = useParams<{token: string}>();
    const navigate = useNavigate();

    const { resetPassword, isLoading, error } = useAuthStore();

    const newPasswordSubmit = async (data : UserType) => {
      const {password, confirmPassword} = data

      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      if (!token) {
        toast.error("Reset token is missing!");
        return;
      }

      try {
        await resetPassword(token, password);
        toast.success(
          "Password reset successfully! 👍 We are sending you back to the login page ..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error(error);
        toast.error("Error resetting password! 👎");
      }
    }


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
        className="flex-1 flex justify-center items-center w-full"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">
              Reset Password
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Create your new password
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form
              className="grid gap-4"
              onSubmit={handleSubmit(newPasswordSubmit)}
            >
              <FormInput
                inputType="password"
                iconType={Lock}
                placeHolder="New Password"
                name="password"
                register={register}
                errors={errors}
              />

              <FormInput
                inputType="password"
                iconType={Lock}
                placeHolder="Confirm New Password"
                name="confirmPassword"
                register={register}
                errors={errors}
              />

              {error && (
                <p className="text-red-500 font-semibold mt-1 text-center">
                  {error}
                </p>
              )}

              <Button type="submit" className="bg-violet-950 py-6">
                {isLoading ? "Resetting..." : "Set New Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default ResetPasswordPage;
