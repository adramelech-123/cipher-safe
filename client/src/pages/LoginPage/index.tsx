
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, Lock, Mail} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import BrandHeader from "@/components/BrandHeader";
import { UserType } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/lib/formValidation";
import FormInput from "@/components/FormInput";

const LoginPage = () => {

 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({ resolver: zodResolver(loginSchema) });


  const navigate = useNavigate()

  const { login, isLoading, error} = useAuthStore();

   const submitLogin = async (data: UserType) => {
  
     const { email, password} = data;

     try {
       await login(email, password);
       navigate("/");
     } catch (error) {
       console.error("Login error:", error);
     }
   };

   
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen w-full">
      {/* Header Large Screens */}
      <div className="lg:flex flex-1 hidden justify-center items-center bg-black bg-opacity-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className={`h-full w-full bg-cover bg-center bg-[url('/cipherwallanime2.jpg')]`}
        >
          <BrandHeader
            logoSize="w-32 h-32"
            headingSize="text-8xl"
            subTextSize="text-lg mt-5"
            addClass="h-full bg-violet-950 bg-opacity-60"
          />
        </motion.div>
      </div>

      {/* Header Small Screens */}
      <BrandHeader
        logoSize="w-12 h-12"
        headingSize="text-4xl"
        subTextSize="text-xs mt-2"
        addClass="lg:hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex justify-center items-center"
      >
        <Card className="w-3/4 xl:w-1/2 md:w-2/3">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">Sign In</CardTitle>
            <CardDescription className="text-lg text-center">
              Welcome back! Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={handleSubmit(submitLogin)}
            >
              <FormInput
                title="Email"
                inputType="email"
                iconType={Mail}
                placeHolder="Enter your email address"
                name="email"
                register={register}
                errors={errors}
              />

              <FormInput
                title="Password"
                inputType="password"
                iconType={Lock}
                placeHolder="Enter your password"
                name="password"
                register={register}
                errors={errors}
              />
              <div className="flex items-center mb-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              {error && (
                <p className="text-red-500 font-semibold mt-1 text-center">
                  {error}
                </p>
              )}

              <Button className="bg-violet-950 py-6">
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" size={24} />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="py-4 flex justify-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-purple-500 hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
export default LoginPage;
