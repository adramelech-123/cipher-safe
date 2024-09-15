import IconInput from "@/components/IconInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail} from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 hidden lg:flex  justify-center items-center bg-black bg-opacity-5">
        <div
          className={`h-full w-full bg-cover bg-center bg-[url('/animesec.webp')]`}
        >
          <div className="flex flex-col justify-center items-center h-full w-full  bg-violet-950 bg-opacity-60 font-black text-center">
            <span className="flex flex-col gap-2 items-center justify-center">
              <img src="ciphersafe.svg" alt="" className="h-32 w-32" />
              <h1 className="text-8xl">CipherSafe</h1>
            </span>

            <p className="text-lg font-normal mt-5 italic">
              Protect your accounts with Unbreakable Security
            </p>
          </div>
        </div>
      </div>
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
            <form className="grid gap-4">
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
                />
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
                />
              </div>
              <div className="flex items-center mb-4">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="bg-violet-950 py-6">
                Sign In
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
