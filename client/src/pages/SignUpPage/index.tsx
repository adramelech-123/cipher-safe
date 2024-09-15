import IconInput from "@/components/IconInput";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, User} from "lucide-react"
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const SignUpPage = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 hidden lg:flex  justify-center items-center bg-black bg-opacity-5">
        <div
          className={`h-full w-full bg-cover bg-center bg-[url('/animesec.webp')]`}
        >
          <div className="flex flex-col justify-center items-center h-full w-full  bg-violet-950 bg-opacity-70 font-black text-center">
            {/* <p className="text-4xl text-left">Welcome to</p> */}
            <span className="flex flex-col gap-2 items-center justify-center">
              <img src="ciphersafe.svg" alt="" className="h-32 w-32"/>
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
            <CardTitle className="text-3xl text-center mb-4">
              Create an account
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
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
              />
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
              />
            </div>
            <Button className="bg-violet-950 py-6">Sign Up</Button>
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