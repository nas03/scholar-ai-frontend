import { BarChart3, Bell, Brain, FileText, GraduationCap, Sparkles } from "lucide-react";
import * as React from 'react';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
interface HomePageProps {
  onNavigate: (page: 'signin' | 'signup' | 'dashboard') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">ScholarAI</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => onNavigate('signin')}>
                Sign In
              </Button>
              <Button onClick={() => onNavigate('signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered Academic Assistant</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
                Take Control of Your Academic Journey
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                ScholarAI is an intelligent academic management system designed for university students. 
                Organize courses, manage study materials, track performance, and enhance learning with AI.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => onNavigate('signup')}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('signin')}>
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="Students studying together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike traditional LMS platforms built for instructors, ScholarAI is student-centric, 
              putting you in control of your learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">AI-Powered Notes</h3>
              <p className="text-muted-foreground">
                Automatically summarize your notes and get AI-generated insights to enhance understanding.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Smart Quizzes</h3>
              <p className="text-muted-foreground">
                Generate practice quizzes from your study materials to test your knowledge effectively.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">GPA Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your academic performance with detailed analytics and GPA calculations.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Study Reminders</h3>
              <p className="text-muted-foreground">
                Never miss a deadline with smart notifications for assignments and exam prep.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Course Organization</h3>
              <p className="text-muted-foreground">
                Keep all your courses, materials, and schedules organized in one central place.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2">Personalized Learning</h3>
              <p className="text-muted-foreground">
                AI adapts to your learning style and suggests optimal study strategies.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Ready to Transform Your Academic Experience?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students who are taking control of their learning journey with ScholarAI.
          </p>
          <Button size="lg" onClick={() => onNavigate('signup')}>
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 ScholarAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
