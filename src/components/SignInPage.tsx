import { AlertCircle, ArrowLeft, GraduationCap } from "lucide-react";
import * as React from 'react';
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
interface SignInPageProps {
  onNavigate: (page: 'home' | 'signup' | 'dashboard') => void;
}

export function SignInPage({ onNavigate }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("");
      return true;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }
    
    // Mock authentication - check credentials
    const MOCK_EMAIL = "nguyenanhson@gmail.com";
    const MOCK_PASSWORD = "@Nas2003";
    
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      console.log("Sign in successful:", { email, rememberMe });
      // Navigate to dashboard after successful signin
      onNavigate('dashboard');
    } else {
      alert("Invalid email or password. Please use:\nEmail: nguyenanhson@gmail.com\nPassword: @Nas2003");
    }
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

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
              <p className="text-sm mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-sm text-muted-foreground font-mono">
                <p>Email: nguyenanhson@gmail.com</p>
                <p>Password: @Nas2003</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  className={`bg-input-background ${emailError ? 'border-red-500' : ''}`}
                />
                {emailError && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {emailError}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input-background"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">OR</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => onNavigate('dashboard')}
              >
                Quick Demo Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
