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
import { Lock } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";

const ResetPasswordPage = () => {
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
            <form className="grid gap-4">
              <div className="grid gap-2">
                <IconInput
                  icon={Lock}
                  id="password"
                  type="password"
                  placeholder="New Password"
                  autoComplete="off"
                />

                <IconInput
                  icon={Lock}
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm New Password"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="bg-violet-950 py-6">
                Set New Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default ResetPasswordPage;
