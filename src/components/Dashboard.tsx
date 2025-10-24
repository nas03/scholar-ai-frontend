import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  Network,
  Settings,
  X
} from "lucide-react";
import * as React from 'react';
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { AutoQuizzesPage } from "./dashboard/AutoQuizzesPage";
import { CoursesPage } from "./dashboard/CoursesPage";
import { GPATrackingPage } from "./dashboard/GPATrackingPage";
import { KnowledgeWebPage } from "./dashboard/KnowledgeWebPage";
import { LectureNotesPage } from "./dashboard/LectureNotesPage";
import { PreferencesPage } from "./dashboard/PreferencesPage";
import { SchedulePage } from "./dashboard/SchedulePage";
import { StudyRemindersPage } from "./dashboard/StudyRemindersPage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export type DashboardSection = 
  | 'courses' 
  | 'notes' 
  | 'knowledge-web' 
  | 'gpa' 
  | 'quizzes' 
  | 'reminders' 
  | 'schedule'
  | 'preferences';

interface DashboardProps {
  onLogout: () => void;
  userName?: string;
}

export function Dashboard({ onLogout, userName = "John Doe" }: DashboardProps) {
  const { userPreferences } = useData();
  const [currentSection, setCurrentSection] = useState<DashboardSection>('courses');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  
  const displayName = `${userPreferences.personalInfo.firstName} ${userPreferences.personalInfo.lastName}`;

  const navigationItems = [
    { id: 'courses' as const, label: 'Courses', icon: BookOpen },
    { id: 'notes' as const, label: 'Lecture Notes', icon: FileText },
    { id: 'knowledge-web' as const, label: 'Knowledge Web', icon: Network },
    { id: 'gpa' as const, label: 'GPA Tracking', icon: BarChart3 },
    { id: 'quizzes' as const, label: 'Auto Quizzes', icon: Brain },
    { id: 'reminders' as const, label: 'Study Reminders', icon: Bell },
    { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
    { id: 'preferences' as const, label: 'Preferences', icon: Settings },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'courses':
        return <CoursesPage />;
      case 'notes':
        return <LectureNotesPage />;
      case 'knowledge-web':
        return <KnowledgeWebPage />;
      case 'gpa':
        return <GPATrackingPage />;
      case 'quizzes':
        return <AutoQuizzesPage />;
      case 'reminders':
        return <StudyRemindersPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'preferences':
        return <PreferencesPage />;
      default:
        return <CoursesPage />;
    }
  };

  const initials = `${userPreferences.personalInfo.firstName.charAt(0)}${userPreferences.personalInfo.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border
        transform transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarMinimized ? 'lg:w-20' : 'lg:w-64'}
        ${sidebarMinimized ? 'w-20' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`h-16 flex items-center border-b border-sidebar-border ${sidebarMinimized ? 'justify-center px-2' : 'justify-between px-6'}`}>
            <div className={`flex items-center gap-2 ${sidebarMinimized ? 'justify-center' : ''}`}>
              <GraduationCap className="w-6 h-6 text-primary flex-shrink-0" />
              {!sidebarMinimized && <span className="font-semibold">ScholarAI</span>}
            </div>
            {!sidebarMinimized && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              <TooltipProvider delayDuration={0}>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  
                  const buttonContent = (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
                        ${sidebarMinimized ? 'justify-center' : ''}
                        ${isActive 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarMinimized && <span>{item.label}</span>}
                    </button>
                  );

                  if (sidebarMinimized) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          {buttonContent}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return buttonContent;
                })}
              </TooltipProvider>
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={`flex items-center gap-3 mb-3 w-full hover:bg-sidebar-accent/50 rounded-md p-2 transition-colors ${sidebarMinimized ? 'justify-center' : ''}`}
                    onClick={() => {
                      setCurrentSection('preferences');
                      setSidebarOpen(false);
                    }}
                  >
                    <Avatar className="flex-shrink-0">
                      {userPreferences.personalInfo.profilePicture ? (
                        <AvatarImage src={userPreferences.personalInfo.profilePicture} alt={displayName} />
                      ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                      )}
                    </Avatar>
                    {!sidebarMinimized && (
                      <div className="flex-1 min-w-0 text-left">
                        <p className="truncate">{displayName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {userPreferences.personalInfo.major || 'Student'}
                        </p>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                {sidebarMinimized && (
                  <TooltipContent side="right">
                    <div>
                      <p>{displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {userPreferences.personalInfo.major || 'Student'}
                      </p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>

              {/* Logout and Minimize Buttons */}
              <div className={`space-y-2 ${sidebarMinimized ? 'flex flex-col items-center' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={`${sidebarMinimized ? 'w-10 h-10 p-0' : 'w-full'}`}
                      onClick={onLogout}
                    >
                      <LogOut className={`w-4 h-4 ${sidebarMinimized ? '' : 'mr-2'}`} />
                      {!sidebarMinimized && 'Logout'}
                    </Button>
                  </TooltipTrigger>
                  {sidebarMinimized && (
                    <TooltipContent side="right">
                      <p>Logout</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`hidden lg:flex ${sidebarMinimized ? 'w-10 h-10 p-0' : 'w-full'}`}
                      onClick={() => setSidebarMinimized(!sidebarMinimized)}
                    >
                      {sidebarMinimized ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <>
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Minimize
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {sidebarMinimized && (
                    <TooltipContent side="right">
                      <p>Expand Sidebar</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary lg:hidden" />
            <span className="font-semibold lg:hidden">ScholarAI</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
