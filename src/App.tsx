import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { SignInPage } from "./components/SignInPage";
import { SignUpPage, SignUpFormData } from "./components/SignUpPage";
import { OTPVerificationPage } from "./components/OTPVerificationPage";
import { Dashboard } from "./components/Dashboard";
import { DataProvider } from "./contexts/DataContext";
import { Toaster } from "./components/ui/sonner";

type Page = 'home' | 'signin' | 'signup' | 'otp-verification' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpFormData, setSignUpFormData] = useState<SignUpFormData | undefined>(undefined);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setCurrentPage('home');
  };

  const handleSignUpSuccess = (email: string, formData: SignUpFormData) => {
    setSignUpEmail(email);
    // Clear passwords but keep other data
    setSignUpFormData({
      ...formData,
      password: "",
      confirmPassword: ""
    });
    setCurrentPage('otp-verification');
  };

  const handleChangeEmail = () => {
    setCurrentPage('signup');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'signin':
        return <SignInPage onNavigate={handleNavigation} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigation} onSignUpSuccess={handleSignUpSuccess} initialFormData={signUpFormData} />;
      case 'otp-verification':
        return <OTPVerificationPage email={signUpEmail} onNavigate={handleNavigation} onChangeEmail={handleChangeEmail} />;
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <DataProvider>
      <div className="size-full">
        {renderPage()}
        <Toaster />
      </div>
    </DataProvider>
  );
}