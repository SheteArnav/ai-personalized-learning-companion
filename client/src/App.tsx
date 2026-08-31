import React from 'react';
import { useLearning } from './context/LearningContext.js';
import { Layout } from './components/layout/Layout.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard.js';
import { DashboardView } from './components/dashboard/DashboardView.js';
import { RoadmapView } from './components/roadmap/RoadmapView.js';
import { AITutorView } from './components/tutor/AITutorView.js';
import { DocumentAnalysisView } from './components/documents/DocumentAnalysisView.js';
import { QuizArena } from './components/quiz/QuizArena.js';
import { AnalyticsView } from './components/analytics/AnalyticsView.js';
import { SettingsView } from './components/settings/SettingsView.js';

export const App: React.FC = () => {
  const { activeTab } = useLearning();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'onboarding':
        return <OnboardingWizard />;
      case 'dashboard':
        return <DashboardView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'tutor':
        return <AITutorView />;
      case 'documents':
        return <DocumentAnalysisView />;
      case 'quiz':
        return <QuizArena />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <Layout>{renderActiveView()}</Layout>;
};

export default App;
