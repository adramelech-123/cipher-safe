import { motion } from "framer-motion";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandHeader from "@/components/BrandHeader";
import { useAuthStore } from "@/store/authStore";
import toast from 'react-hot-toast'


const VerifyEmailPage = () => {
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement| null)[]>([])
    const {verifyEmail, error, isLoading }= useAuthStore()
    const navigate = useNavigate()

    const handleChange = (index: number, value: string) => {

      // Assuming code is an array of strings
      const newCode: string[] = [...code];

      if (value.length > 1) {
        const pastedCode: string[] = value.slice(0, 6).split("");
        for (let i = 0; i < 6; i++) {
          newCode[i] = pastedCode[i] || "";
        }
        setCode(newCode);

        // Focus on the last non-empty input or the first empty one
        const lastFilledIndex = newCode.reduce(
          (lastIndex, digit, i) => (digit !== "" ? i : lastIndex), -1
        );

        const focusIndex: number = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
        inputRefs.current[focusIndex]?.focus();

      } else {
        newCode[index] = value;
        setCode(newCode);

        // Move focus to the next input field if value is entered
        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
      if(e) e.preventDefault();

      const verificationCode = code.join("");
      try {
        await verifyEmail(verificationCode);
        navigate("/");
        toast.success("Email verified successfully!🙂");
      } catch (error) {
        console.log(error);
      }
    };

    // Auto Submit when all fields are filled
    useEffect(() => {
      if (code.every((digit) => digit !== "")) {
        handleSubmit();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);


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
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-4">
              Verify your email
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Enter the 6-digit code sent to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    maxLength={6}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-violet-200  text-violet-950 border-4 rounded-lg focus:border-violet-600 focus:outline-none"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}
            </form>
            <Button
              type="submit"
              className="bg-violet-950 py-6"
              disabled={isLoading || code.some((digit) => !digit)}
            >
              {isLoading ? "Verify" : "Verifying..."}
            </Button>
          </CardContent>
          <CardFooter className="py-4 flex justify-center">
            <p className="text-sm text-gray-500">
              Not sure how you got here?{" "}
              <Link to={"/signup"} className="text-purple-500 hover:underline">
                Try again
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
export default VerifyEmailPage