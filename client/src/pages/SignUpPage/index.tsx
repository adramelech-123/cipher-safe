import { UserType } from "@/types";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/lib/formValidation";
import {zodResolver} from "@hookform/resolvers/zod"
import IconInput from "@/components/IconInput";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Lock, Mail, User} from "lucide-react"
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import BrandHeader from "@/components/BrandHeader";
import { useAuthStore } from "@/store/authStore";



const SignUpPage = () => {

  const {register, handleSubmit, formState:{errors}} = useForm<UserType>({resolver: zodResolver(signupSchema)})
 
  const {signup, isLoading} = useAuthStore()
  const navigate = useNavigate()

  const submitSignUp = async (data: UserType) => {
    
    const {email, password, username, confirmPassword} = data
  
    try {
      await signup(email, password, username, confirmPassword)
      navigate("/verify-email")
    } catch (error) {
      console.error("Signup error:", error);
    }
  }


  return (
    <div className="flex flex-col  lg:flex-row lg:h-screen w-full lg:my-0 my-10">
      {/* Header Large Screens */}
      <div className="lg:flex flex-1 hidden justify-center items-center bg-black bg-opacity-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className={`h-full w-full bg-cover bg-center bg-[url('/cipherwallanime3.jpg')]`}
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
            <CardTitle className="text-3xl text-center mb-4">
              Create an account
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit(submitSignUp)}>
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-lg">
                  Username
                </Label>

                <IconInput
                  icon={User}
                  id="username"
                  type="text"
                  placeholder="Create a username"
                  autoComplete="off"
                  {...register("username")}
                />
                {errors.username && (
                  <span className="text-sm text-red-700">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>

                <IconInput
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="off"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-700">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-lg">
                  Password
                </Label>

                <IconInput
                  icon={Lock}
                  id="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-sm text-red-700">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-lg">
                  Confirm Password
                </Label>

                <IconInput
                  icon={Lock}
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <span className="text-sm text-red-700">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <Button className="bg-violet-950 py-6">
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" size={24} />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="py-4 flex justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to={"/login"} className="text-purple-500 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
export default SignUpPage