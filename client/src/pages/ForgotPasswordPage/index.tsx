import { motion } from "framer-motion";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IconInput from "@/components/IconInput";
import { Mail } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";

const ForgotPasswordPage = () => {
  return (
    <div className="max-w-md w-full flex flex-col justify-center items-center">
     
      <BrandHeader logoSize="w-12 h-12" headingSize="text-4xl" subTextSize="text-xs mt-2"/>

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
            <form className="grid gap-4">
              <div className="grid gap-2">
                <IconInput
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="bg-violet-950 py-6">
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default ForgotPasswordPage;
