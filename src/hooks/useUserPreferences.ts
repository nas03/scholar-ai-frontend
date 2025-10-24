// User preferences hook for managing user settings and graduation requirements
import { useCallback, useState } from 'react';
import { UserPreferencesService } from '../services';
import { GraduationRequirements, UpdateGraduationRequirementsRequest, UpdateUserPreferencesRequest, UserPreferences } from '../types';

export function useUserPreferences(
  initialPreferences: UserPreferences,
  initialGraduationRequirements: GraduationRequirements
) {
  const [userPreferencesService] = useState(() => 
    new UserPreferencesService(initialPreferences, initialGraduationRequirements)
  );
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(initialPreferences);
  const [graduationRequirements, setGraduationRequirements] = useState<GraduationRequirements>(initialGraduationRequirements);

  const updateUserPreferences = useCallback((preferences: UpdateUserPreferencesRequest) => {
    const updatedPreferences = userPreferencesService.updateUserPreferences(preferences);
    setUserPreferences(updatedPreferences);
    return updatedPreferences;
  }, [userPreferencesService]);

  const updateGraduationRequirements = useCallback((requirements: UpdateGraduationRequirementsRequest) => {
    const updatedRequirements = userPreferencesService.updateGraduationRequirements(requirements);
    setGraduationRequirements(updatedRequirements);
    return updatedRequirements;
  }, [userPreferencesService]);

  const updatePersonalInfo = useCallback((personalInfo: Partial<UserPreferences['personalInfo']>) => {
    const updatedInfo = userPreferencesService.updatePersonalInfo(personalInfo);
    setUserPreferences(userPreferencesService.getUserPreferences());
    return updatedInfo;
  }, [userPreferencesService]);

  const updateAcademicSettings = useCallback((academic: Partial<UserPreferences['academic']>) => {
    const updatedSettings = userPreferencesService.updateAcademicSettings(academic);
    setUserPreferences(userPreferencesService.getUserPreferences());
    return updatedSettings;
  }, [userPreferencesService]);

  const updateAppearanceSettings = useCallback((appearance: Partial<UserPreferences['appearance']>) => {
    const updatedSettings = userPreferencesService.updateAppearanceSettings(appearance);
    setUserPreferences(userPreferencesService.getUserPreferences());
    return updatedSettings;
  }, [userPreferencesService]);

  const calculateGraduationProgress = useCallback((currentCredits: number) => {
    return userPreferencesService.calculateGraduationProgress(currentCredits);
  }, [userPreferencesService]);

  const isGraduationRequirementsMet = useCallback((currentCredits: number) => {
    return userPreferencesService.isGraduationRequirementsMet(currentCredits);
  }, [userPreferencesService]);

  const getRemainingCredits = useCallback((currentCredits: number) => {
    return userPreferencesService.getRemainingCredits(currentCredits);
  }, [userPreferencesService]);

  return {
    userPreferences,
    graduationRequirements,
    updateUserPreferences,
    updateGraduationRequirements,
    updatePersonalInfo,
    updateAcademicSettings,
    updateAppearanceSettings,
    calculateGraduationProgress,
    isGraduationRequirementsMet,
    getRemainingCredits,
  };
}
