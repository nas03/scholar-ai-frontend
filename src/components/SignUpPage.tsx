import { AlertCircle, ArrowLeft, Check, GraduationCap, X } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
interface SignUpPageProps {
	onNavigate: (page: 'home' | 'signin' | 'dashboard') => void;
	onSignUpSuccess: (email: string, formData: SignUpFormData) => void;
	initialFormData?: SignUpFormData;
}

export type SignUpFormData = {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
	agreeToTerms: boolean;
};

export function SignUpPage({
	onNavigate,
	onSignUpSuccess,
	initialFormData,
}: SignUpPageProps) {
	const [formData, setFormData] = useState<SignUpFormData>(
		initialFormData || {
			fullName: '',
			email: '',
			password: '',
			confirmPassword: '',
			agreeToTerms: false,
		}
	);
	const [emailError, setEmailError] = useState('');

	// Password strength calculation
	const passwordStrength = useMemo(() => {
		const password = formData.password;
		if (!password) return { score: 0, label: '', color: '' };

		let score = 0;
		const checks = {
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /[0-9]/.test(password),
			special: /[^A-Za-z0-9]/.test(password),
		};

		score = Object.values(checks).filter(Boolean).length;

		if (score <= 2)
			return { score, label: 'Weak', color: 'bg-red-500', checks };
		if (score === 3)
			return { score, label: 'Fair', color: 'bg-orange-500', checks };
		if (score === 4)
			return { score, label: 'Good', color: 'bg-yellow-500', checks };
		return { score, label: 'Strong', color: 'bg-green-500', checks };
	}, [formData.password]);

	// Email validation
	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			setEmailError('');
			return true;
		}
		if (!emailRegex.test(email)) {
			setEmailError('Please enter a valid email address');
			return false;
		}
		if (!email.endsWith('.edu')) {
			setEmailError('We recommend using your university email (.edu)');
			return true; // Warning, not error
		}
		setEmailError('');
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateEmail(formData.email)) {
			return;
		}

		if (formData.password.length < 8) {
			alert('Password must be at least 8 characters long');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			alert("Passwords don't match!");
			return;
		}

		if (!formData.agreeToTerms) {
			alert('Please agree to the terms and conditions');
			return;
		}

		// Handle sign up logic here
		console.log('Sign up:', formData);
		// Navigate to OTP verification page after successful signup
		onSignUpSuccess(formData.email, formData);
	};

	const handleChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (field === 'email' && typeof value === 'string') {
			validateEmail(value);
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
							className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<GraduationCap className="w-8 h-8 text-primary" />
							<span className="text-xl font-semibold">ScholarAI</span>
						</button>
					</div>
				</div>
			</nav>

			{/* Sign Up Form */}
			<div className="flex-1 flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-md">
					<Button
						variant="ghost"
						onClick={() => onNavigate('home')}
						className="mb-6">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Button>

					<Card className="p-8">
						<div className="mb-8">
							<h1 className="text-3xl mb-2">Create Your Account</h1>
							<p className="text-muted-foreground">
								Start your journey to academic excellence
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="fullName">Full Name</Label>
								<Input
									id="fullName"
									type="text"
									placeholder="John Doe"
									value={formData.fullName}
									onChange={(e) => handleChange('fullName', e.target.value)}
									required
									className="bg-input-background"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@university.edu"
									value={formData.email}
									onChange={(e) => handleChange('email', e.target.value)}
									required
									className={`bg-input-background ${emailError && !formData.email.endsWith('.edu') ? 'border-red-500' : ''}`}
								/>
								{emailError && (
									<div
										className={`flex items-center gap-2 text-sm ${formData.email.endsWith('.edu') ? 'text-muted-foreground' : 'text-red-500'}`}>
										<AlertCircle className="w-4 h-4" />
										{emailError}
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) => handleChange('password', e.target.value)}
									required
									className="bg-input-background"
								/>
								{formData.password && (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
												<div
													className={`h-full transition-all ${passwordStrength.color}`}
													style={{
														width: `${(passwordStrength.score / 5) * 100}%`,
													}}
												/>
											</div>
											<span className="text-xs">{passwordStrength.label}</span>
										</div>
										<div className="grid grid-cols-2 gap-2 text-xs">
											<div
												className={`flex items-center gap-1 ${passwordStrength.checks?.length ? 'text-green-600' : 'text-muted-foreground'}`}>
												{passwordStrength.checks?.length ? (
													<Check className="w-3 h-3" />
												) : (
													<X className="w-3 h-3" />
												)}
												8+ characters
											</div>
											<div
												className={`flex items-center gap-1 ${passwordStrength.checks?.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
												{passwordStrength.checks?.uppercase ? (
													<Check className="w-3 h-3" />
												) : (
													<X className="w-3 h-3" />
												)}
												Uppercase
											</div>
											<div
												className={`flex items-center gap-1 ${passwordStrength.checks?.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
												{passwordStrength.checks?.lowercase ? (
													<Check className="w-3 h-3" />
												) : (
													<X className="w-3 h-3" />
												)}
												Lowercase
											</div>
											<div
												className={`flex items-center gap-1 ${passwordStrength.checks?.number ? 'text-green-600' : 'text-muted-foreground'}`}>
												{passwordStrength.checks?.number ? (
													<Check className="w-3 h-3" />
												) : (
													<X className="w-3 h-3" />
												)}
												Number
											</div>
											<div
												className={`flex items-center gap-1 ${passwordStrength.checks?.special ? 'text-green-600' : 'text-muted-foreground'}`}>
												{passwordStrength.checks?.special ? (
													<Check className="w-3 h-3" />
												) : (
													<X className="w-3 h-3" />
												)}
												Special char
											</div>
										</div>
									</div>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="••••••••"
									value={formData.confirmPassword}
									onChange={(e) =>
										handleChange('confirmPassword', e.target.value)
									}
									required
									className="bg-input-background"
								/>
							</div>

							<div className="flex items-start space-x-2">
								<Checkbox
									id="terms"
									checked={formData.agreeToTerms}
									onCheckedChange={(checked) =>
										handleChange('agreeToTerms', checked as boolean)
									}
								/>
								<Label htmlFor="terms" className="cursor-pointer leading-snug">
									I agree to the Terms of Service and Privacy Policy
								</Label>
							</div>

							<Button type="submit" className="w-full" size="lg">
								Create Account
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-muted-foreground">
								Already have an account?{' '}
								<button
									onClick={() => onNavigate('signin')}
									className="text-primary hover:underline">
									Sign in
								</button>
							</p>
						</div>
					</Card>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						By signing up, you confirm that you're a university student.
					</p>
				</div>
			</div>
		</div>
	);
}
