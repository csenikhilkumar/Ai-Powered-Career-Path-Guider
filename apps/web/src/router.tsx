import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import OnboardingLayout from "./pages/Onboarding/OnboardingLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import CareerDetails from "./pages/Career/CareerDetails";
import Settings from "./pages/Settings";
import Learning from "./pages/Learning/Learning";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import CareerList from "./pages/Career/CareerList";
import SkillMapping from "./pages/Career/SkillMapping";
import CareerWizard from './pages/Career/CareerWizard';
import CareerRoadmap from './pages/Career/CareerRoadmap';
import CareerJourney from './pages/Career/CareerJourney';
import Jobs from './pages/Jobs/Jobs';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/onboarding",
        element: (
            <ProtectedRoute>
                <OnboardingLayout />
            </ProtectedRoute>
        ),
    },
    {
        path: "/auth/login",
        element: <Login />,
    },
    {
        path: "/auth/register",
        element: <Register />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <AppShell />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "careers",
                element: <CareerList />
            },
            {
                path: "career",
                element: <Navigate to="/dashboard/careers" replace />
            },
            {
                path: "career/:id",
                element: <CareerDetails />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "learning",
                element: <Learning />
            },
            {
                path: "skill-mapping",
                element: <SkillMapping />
            },
            {
                path: "career-wizard",
                element: <CareerWizard />
            },
            {
                path: "career-roadmap",
                element: <CareerRoadmap />
            },
            {
                path: "career-journey/:id",
                element: <CareerJourney />
            },
            {
                path: "jobs",
                element: <Jobs />
            }
        ]
    }
]);
