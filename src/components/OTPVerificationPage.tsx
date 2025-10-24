import { ArrowLeft, GraduationCap, Mail } from "lucide-react";
import * as React from 'react';
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
interface OTPVerificationPageProps {
  email: string;
  onNavigate: (page: 'home' | 'signin' | 'signup' | 'dashboard') => void;
  onChangeEmail: () => void;
}

export function OTPVerificationPage({ email, onNavigate, onChangeEmail }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  
  // Mock OTP for testing purposes (in real app, this would be sent to user's email)
  const MOCK_OTP = "123456";

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate verification delay
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        toast.success("Email verified successfully!");
        setTimeout(() => {
          onNavigate('dashboard');
        }, 500);
      } else {
        setError("Invalid verification code. Please try again.");
        toast.error("Invalid verification code");
        setOtp("");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResendOTP = () => {
    setOtp("");
    setError("");
    toast.success("Verification code sent to your email!");
    // In a real app, this would trigger an API call to send a new OTP
  };

  const handleChangeEmail = () => {
    onChangeEmail();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">ScholarAI</span>
            </button>
          </div>
        </div>
      </nav>

      {/* OTP Verification Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => onNavigate('signup')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </Button>

          <Card className="p-8">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl mb-2">Verify Your Email</h1>
              <p className="text-muted-foreground">
                We've sent a verification code to
              </p>
              <p className="text-muted-foreground mt-1">
                {email}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-center block">Enter verification code</label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setError("");
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center mt-2">{error}</p>
                )}
              </div>

              <Button 
                onClick={handleVerifyOTP} 
                className="w-full" 
                size="lg"
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-primary hover:underline"
                  >
                    Send again
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    onClick={handleChangeEmail}
                    className="text-sm text-primary hover:underline"
                  >
                    Change my email
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                For testing purposes, use code: <span className="font-mono font-semibold">123456</span>
              </p>
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Make sure to check your spam folder if you don't see the email.
          </p>
        </div>
      </div>
    </div>
  );
}
