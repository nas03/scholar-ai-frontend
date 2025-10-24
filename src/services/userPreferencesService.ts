// User preferences service for managing user settings
import { GraduationRequirements, UpdateGraduationRequirementsRequest, UpdateUserPreferencesRequest, UserPreferences } from '../types';

export class UserPreferencesService {
  private userPreferences: UserPreferences;
  private graduationRequirements: GraduationRequirements;

  constructor(
    initialPreferences: UserPreferences,
    initialGraduationRequirements: GraduationRequirements
  ) {
    this.userPreferences = { ...initialPreferences };
    this.graduationRequirements = { ...initialGraduationRequirements };
  }

  // Get user preferences
  getUserPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  // Get graduation requirements
  getGraduationRequirements(): GraduationRequirements {
    return { ...this.graduationRequirements };
  }

  // Update user preferences
  updateUserPreferences(preferences: UpdateUserPreferencesRequest): UserPreferences {
    this.userPreferences = {
      ...this.userPreferences,
      ...preferences,
      personalInfo: preferences.personalInfo 
        ? { ...this.userPreferences.personalInfo, ...preferences.personalInfo }
        : this.userPreferences.personalInfo,
      academic: preferences.academic 
        ? { ...this.userPreferences.academic, ...preferences.academic }
        : this.userPreferences.academic,
      appearance: preferences.appearance 
        ? { ...this.userPreferences.appearance, ...preferences.appearance }
        : this.userPreferences.appearance
    };
    return this.getUserPreferences();
  }

  // Update graduation requirements
  updateGraduationRequirements(requirements: UpdateGraduationRequirementsRequest): GraduationRequirements {
    this.graduationRequirements = { ...this.graduationRequirements, ...requirements };
    return this.getGraduationRequirements();
  }

  // Get personal info
  getPersonalInfo() {
    return { ...this.userPreferences.personalInfo };
  }

  // Update personal info
  updatePersonalInfo(personalInfo: Partial<UserPreferences['personalInfo']>) {
    this.userPreferences.personalInfo = { ...this.userPreferences.personalInfo, ...personalInfo };
    return this.getPersonalInfo();
  }

  // Get academic settings
  getAcademicSettings() {
    return { ...this.userPreferences.academic };
  }

  // Update academic settings
  updateAcademicSettings(academic: Partial<UserPreferences['academic']>) {
    this.userPreferences.academic = { ...this.userPreferences.academic, ...academic };
    return this.getAcademicSettings();
  }

  // Get appearance settings
  getAppearanceSettings() {
    return { ...this.userPreferences.appearance };
  }

  // Update appearance settings
  updateAppearanceSettings(appearance: Partial<UserPreferences['appearance']>) {
    this.userPreferences.appearance = { ...this.userPreferences.appearance, ...appearance };
    return this.getAppearanceSettings();
  }

  // Calculate graduation progress
  calculateGraduationProgress(currentCredits: number): number {
    if (this.graduationRequirements.requiredCredits === 0) return 0;
    return Math.min((currentCredits / this.graduationRequirements.requiredCredits) * 100, 100);
  }

  // Check if graduation requirements are met
  isGraduationRequirementsMet(currentCredits: number): boolean {
    return currentCredits >= this.graduationRequirements.requiredCredits;
  }

  // Get remaining credits needed
  getRemainingCredits(currentCredits: number): number {
    return Math.max(this.graduationRequirements.requiredCredits - currentCredits, 0);
  }

  // Set user preferences (for initialization)
  setUserPreferences(preferences: UserPreferences): void {
    this.userPreferences = { ...preferences };
  }

  // Set graduation requirements (for initialization)
  setGraduationRequirements(requirements: GraduationRequirements): void {
    this.graduationRequirements = { ...requirements };
  }
}
