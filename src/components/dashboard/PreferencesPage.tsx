import {
  Camera,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Palette,
  Save,
  Smartphone,
  User,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useData } from '../../contexts/DataContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
export function PreferencesPage() {
	const { userPreferences, updateUserPreferences } = useData();

	// Personal Info State
	const [personalInfo, setPersonalInfo] = useState(
		userPreferences.personalInfo
	);

	// Academic Preferences State
	const [gpaScale, setGpaScale] = useState(userPreferences.academic.gpaScale);

	// Appearance State
	const [theme, setTheme] = useState(userPreferences.appearance.theme);

	// Password State
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	// Profile Picture Upload
	const [previewImage, setPreviewImage] = useState(
		personalInfo.profilePicture || ''
	);

	// Phone Verification State
	const [showPhoneVerification, setShowPhoneVerification] = useState(false);
	const [phoneOTP, setPhoneOTP] = useState('');
	const [phoneVerificationError, setPhoneVerificationError] = useState('');
	const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
	const [pendingPhoneNumber, setPendingPhoneNumber] = useState('');

	// Mock OTP for testing SMS verification
	const MOCK_PHONE_OTP = '654321';

	const handleProfilePictureChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSavePersonalInfo = () => {
		// Check if phone number has changed
		const phoneChanged =
			personalInfo.phoneNumber !== userPreferences.personalInfo.phoneNumber;

		if (
			phoneChanged &&
			personalInfo.phoneNumber &&
			personalInfo.phoneNumber.trim() !== ''
		) {
			// Trigger phone verification
			setPendingPhoneNumber(personalInfo.phoneNumber);
			setShowPhoneVerification(true);
			toast.info('SMS verification code sent to your new phone number');
			// In a real app, this would call an API to send SMS
			return;
		}

		// Save without phone verification if phone didn't change
		updateUserPreferences({
			personalInfo: {
				...personalInfo,
				profilePicture: previewImage,
			},
		});
		toast.success('Personal information updated successfully!');
	};

	const handleVerifyPhone = () => {
		if (phoneOTP.length !== 6) {
			setPhoneVerificationError('Please enter a 6-digit code');
			return;
		}

		setIsVerifyingPhone(true);
		setPhoneVerificationError('');

		// Simulate verification delay
		setTimeout(() => {
			if (phoneOTP === MOCK_PHONE_OTP) {
				// Verification successful - update phone number
				updateUserPreferences({
					personalInfo: {
						...personalInfo,
						phoneNumber: pendingPhoneNumber,
						profilePicture: previewImage,
					},
				});
				toast.success('Phone number verified and updated successfully!');
				setShowPhoneVerification(false);
				setPhoneOTP('');
				setPendingPhoneNumber('');
			} else {
				setPhoneVerificationError(
					'Invalid verification code. Please try again.'
				);
				toast.error('Invalid verification code');
				setPhoneOTP('');
			}
			setIsVerifyingPhone(false);
		}, 1000);
	};

	const handleResendPhoneOTP = () => {
		setPhoneOTP('');
		setPhoneVerificationError('');
		toast.success('Verification code sent to your phone!');
		// In a real app, this would trigger an API call to send a new SMS OTP
	};

	const handleCancelPhoneVerification = () => {
		setShowPhoneVerification(false);
		setPhoneOTP('');
		setPhoneVerificationError('');
		setPendingPhoneNumber('');
		// Revert phone number to original
		setPersonalInfo((prev) => ({
			...prev,
			phoneNumber: userPreferences.personalInfo.phoneNumber,
		}));
	};

	const handleSaveAcademicPreferences = () => {
		updateUserPreferences({
			academic: { gpaScale },
		});
		toast.success('Academic preferences updated successfully!');
	};

	const handleSaveAppearance = () => {
		updateUserPreferences({
			appearance: { theme },
		});

		// Apply theme
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else if (theme === 'light') {
			document.documentElement.classList.remove('dark');
		} else {
			// System preference
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}

		toast.success('Appearance settings updated successfully!');
	};

	const handleChangePassword = () => {
		if (
			!passwordForm.currentPassword ||
			!passwordForm.newPassword ||
			!passwordForm.confirmPassword
		) {
			toast.error('Please fill in all password fields');
			return;
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}

		if (passwordForm.newPassword.length < 8) {
			toast.error('Password must be at least 8 characters long');
			return;
		}

		// Mock password change (in real app, this would call an API)
		toast.success('Password changed successfully!');
		setPasswordForm({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
	};

	const getInitials = () => {
		return `${personalInfo.firstName.charAt(0)}${personalInfo.lastName.charAt(0)}`.toUpperCase();
	};

	const getGPAScaleDescription = (scale: string) => {
		switch (scale) {
			case '4.0':
				return 'Standard US system (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)';
			case '5.0':
				return 'Weighted system with honors (A=5.0, B=4.0, C=3.0, D=2.0, F=0.0)';
			case '10.0':
				return 'European system (10=highest, 0=lowest)';
			default:
				return '';
		}
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<h2 className="text-2xl mb-1">Preferences</h2>
				<p className="text-muted-foreground">
					Manage your account settings and preferences
				</p>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="personal" className="space-y-6">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="personal" className="flex items-center gap-2">
						<User className="w-4 h-4" />
						Personal
					</TabsTrigger>
					<TabsTrigger value="academic" className="flex items-center gap-2">
						<GraduationCap className="w-4 h-4" />
						Academic
					</TabsTrigger>
					<TabsTrigger value="security" className="flex items-center gap-2">
						<Lock className="w-4 h-4" />
						Security
					</TabsTrigger>
					<TabsTrigger value="appearance" className="flex items-center gap-2">
						<Palette className="w-4 h-4" />
						Appearance
					</TabsTrigger>
				</TabsList>

				{/* Personal Information Tab */}
				<TabsContent value="personal">
					<Card className="p-6">
						<div className="space-y-6">
							<div>
								<h3 className="mb-1">Personal Information</h3>
								<p className="text-sm text-muted-foreground">
									Update your personal details and profile picture
								</p>
							</div>

							<Separator />

							{/* Profile Picture */}
							<div className="flex items-center gap-6">
								<Avatar className="w-24 h-24">
									<AvatarImage
										src={previewImage}
										alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
									/>
									<AvatarFallback className="text-2xl">
										{getInitials()}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<Label htmlFor="profile-picture" className="cursor-pointer">
										<div className="flex items-center gap-2 text-sm text-primary hover:underline mb-2">
											<Camera className="w-4 h-4" />
											Change profile picture
										</div>
									</Label>
									<Input
										id="profile-picture"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleProfilePictureChange}
									/>
									<p className="text-xs text-muted-foreground">
										JPG, PNG or GIF. Max size 2MB.
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										value={personalInfo.firstName}
										onChange={(e) =>
											setPersonalInfo({
												...personalInfo,
												firstName: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										value={personalInfo.lastName}
										onChange={(e) =>
											setPersonalInfo({
												...personalInfo,
												lastName: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={personalInfo.email}
									onChange={(e) =>
										setPersonalInfo({ ...personalInfo, email: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input
									id="phoneNumber"
									type="tel"
									value={personalInfo.phoneNumber || ''}
									onChange={(e) =>
										setPersonalInfo({
											...personalInfo,
											phoneNumber: e.target.value,
										})
									}
									placeholder="+1 (555) 123-4567"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="studentId">Student ID</Label>
									<Input
										id="studentId"
										value={personalInfo.studentId || ''}
										onChange={(e) =>
											setPersonalInfo({
												...personalInfo,
												studentId: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="major">Major</Label>
									<Input
										id="major"
										value={personalInfo.major || ''}
										onChange={(e) =>
											setPersonalInfo({
												...personalInfo,
												major: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleSavePersonalInfo}>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>

				{/* Academic Preferences Tab */}
				<TabsContent value="academic">
					<Card className="p-6">
						<div className="space-y-6">
							<div>
								<h3 className="mb-1">Academic Preferences</h3>
								<p className="text-sm text-muted-foreground">
									Configure your academic settings and GPA calculation
								</p>
							</div>

							<Separator />

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="gpaScale">GPA Calculation System</Label>
									<Select
										value={gpaScale}
										onValueChange={(value: any) => setGpaScale(value)}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="4.0">
												4.0 Scale (Standard US)
											</SelectItem>
											<SelectItem value="5.0">5.0 Scale (Weighted)</SelectItem>
											<SelectItem value="10.0">
												10.0 Scale (European)
											</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										{getGPAScaleDescription(gpaScale)}
									</p>
								</div>

								<Card className="p-4 bg-muted">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm">Current GPA Scale</span>
											<span className="text-sm">{gpaScale} System</span>
										</div>
										<Separator />
										<div className="text-xs text-muted-foreground">
											<p className="mb-2">
												Note: Changing the GPA scale will affect how your grades
												are displayed throughout the application.
											</p>
											<p>
												Your existing grades will be automatically converted to
												the new scale.
											</p>
										</div>
									</div>
								</Card>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleSaveAcademicPreferences}>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>

				{/* Security Tab */}
				<TabsContent value="security">
					<Card className="p-6">
						<div className="space-y-6">
							<div>
								<h3 className="mb-1">Security Settings</h3>
								<p className="text-sm text-muted-foreground">
									Manage your password and account security
								</p>
							</div>

							<Separator />

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="currentPassword">Current Password</Label>
									<div className="relative">
										<Input
											id="currentPassword"
											type={showPasswords.current ? 'text' : 'password'}
											value={passwordForm.currentPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													currentPassword: e.target.value,
												})
											}
											placeholder="Enter current password"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full"
											onClick={() =>
												setShowPasswords({
													...showPasswords,
													current: !showPasswords.current,
												})
											}>
											{showPasswords.current ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password</Label>
									<div className="relative">
										<Input
											id="newPassword"
											type={showPasswords.new ? 'text' : 'password'}
											value={passwordForm.newPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													newPassword: e.target.value,
												})
											}
											placeholder="Enter new password"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full"
											onClick={() =>
												setShowPasswords({
													...showPasswords,
													new: !showPasswords.new,
												})
											}>
											{showPasswords.new ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showPasswords.confirm ? 'text' : 'password'}
											value={passwordForm.confirmPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													confirmPassword: e.target.value,
												})
											}
											placeholder="Confirm new password"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full"
											onClick={() =>
												setShowPasswords({
													...showPasswords,
													confirm: !showPasswords.confirm,
												})
											}>
											{showPasswords.confirm ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
								</div>

								<Card className="p-4 bg-muted">
									<p className="text-sm mb-2">Password Requirements:</p>
									<ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
										<li>At least 8 characters long</li>
										<li>Include uppercase and lowercase letters</li>
										<li>Include at least one number</li>
										<li>Include at least one special character</li>
									</ul>
								</Card>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleChangePassword}>
									<Lock className="w-4 h-4 mr-2" />
									Change Password
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>

				{/* Appearance Tab */}
				<TabsContent value="appearance">
					<Card className="p-6">
						<div className="space-y-6">
							<div>
								<h3 className="mb-1">Appearance Settings</h3>
								<p className="text-sm text-muted-foreground">
									Customize the look and feel of your application
								</p>
							</div>

							<Separator />

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="theme">Theme</Label>
									<Select
										value={theme}
										onValueChange={(value: any) => setTheme(value)}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="light">Light</SelectItem>
											<SelectItem value="dark">Dark</SelectItem>
											<SelectItem value="system">System</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										Choose your preferred color theme. System will use your
										device's theme preference.
									</p>
								</div>

								{/* Theme Preview */}
								<div className="grid grid-cols-3 gap-4">
									<Card
										className={`p-4 cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
										onClick={() => setTheme('light')}>
										<div className="space-y-2">
											<div className="w-full h-20 bg-white border border-gray-200 rounded flex items-center justify-center">
												<div className="text-sm text-gray-900">Light</div>
											</div>
											<p className="text-xs text-center">Light Theme</p>
										</div>
									</Card>

									<Card
										className={`p-4 cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
										onClick={() => setTheme('dark')}>
										<div className="space-y-2">
											<div className="w-full h-20 bg-gray-900 border border-gray-700 rounded flex items-center justify-center">
												<div className="text-sm text-gray-100">Dark</div>
											</div>
											<p className="text-xs text-center">Dark Theme</p>
										</div>
									</Card>

									<Card
										className={`p-4 cursor-pointer transition-all ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
										onClick={() => setTheme('system')}>
										<div className="space-y-2">
											<div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 border border-gray-400 rounded flex items-center justify-center">
												<div className="text-sm">Auto</div>
											</div>
											<p className="text-xs text-center">System</p>
										</div>
									</Card>
								</div>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleSaveAppearance}>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Phone Verification Dialog */}
			<Dialog
				open={showPhoneVerification}
				onOpenChange={setShowPhoneVerification}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-center">
							Verify Phone Number
						</DialogTitle>
						<DialogDescription className="text-center">
							We've sent a verification code to {pendingPhoneNumber}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-6 py-4">
						<div className="space-y-2">
							<label className="text-sm text-center block">
								Enter verification code
							</label>
							<div className="flex justify-center">
								<InputOTP
									maxLength={6}
									value={phoneOTP}
									onChange={(value) => {
										setPhoneOTP(value);
										setPhoneVerificationError('');
									}}>
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
							{phoneVerificationError && (
								<p className="text-sm text-red-500 text-center mt-2">
									{phoneVerificationError}
								</p>
							)}
						</div>

						<div className="space-y-3">
							<Button
								onClick={handleVerifyPhone}
								className="w-full"
								disabled={isVerifyingPhone || phoneOTP.length !== 6}>
								<Smartphone className="w-4 h-4 mr-2" />
								{isVerifyingPhone ? 'Verifying...' : 'Verify Phone Number'}
							</Button>

							<div className="text-center">
								<p className="text-sm text-muted-foreground mb-2">
									Didn't receive the code?
								</p>
								<div className="flex justify-center gap-4">
									<button
										onClick={handleResendPhoneOTP}
										className="text-sm text-primary hover:underline">
										Send again
									</button>
									<span className="text-muted-foreground">•</span>
									<button
										onClick={handleCancelPhoneVerification}
										className="text-sm text-primary hover:underline">
										Cancel
									</button>
								</div>
							</div>
						</div>

						<div className="p-4 bg-muted rounded-lg">
							<p className="text-xs text-muted-foreground text-center">
								For testing purposes, use code:{' '}
								<span className="font-mono font-semibold">654321</span>
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
