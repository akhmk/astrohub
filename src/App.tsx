/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StartSection from "./components/StartSection";
import FeaturesChess from "./components/FeaturesChess";
import BentoGrid from "./components/BentoGrid";
import CtaFooter from "./components/CtaFooter";
import Courses from "./pages/Courses";
import Forum from "./pages/Forum";
import Clubs from "./pages/Clubs";
import Blog from "./pages/Blog";
import Roadmaps from "./pages/Roadmaps";
import Labs from "./pages/Labs";
import Learning from "./pages/Learning";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";

export type ViewState = "home" | "courses" | "forum" | "clubs" | "blog" | "roadmaps" | "labs" | "auth" | "learning";

export default function App() {
  const [view, setView] = useState<ViewState>("home");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { user, profile, logout } = useAuth();

  const navigateTo = (v: ViewState) => setView(v);

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView("learning");
  };

  return (
    <div className="bg-black min-h-screen selection:bg-white selection:text-black">
      {view !== "auth" && view !== "learning" && (
        <Navbar
          onNavigate={navigateTo}
          user={user}
          profile={profile}
          onLogout={logout}
        />
      )}
      <main>
        {view === "home" && (
          user ? (
            <Dashboard user={user} profile={profile} onNavigate={navigateTo} onStartCourse={handleStartCourse} />
          ) : (
            <>
              <Hero onNavigate={navigateTo} />
              <div className="bg-black">
                <StartSection onNavigate={navigateTo} />
                <FeaturesChess onNavigate={navigateTo} />
                <BentoGrid onNavigate={navigateTo} />
                <CtaFooter onNavigate={navigateTo} />
              </div>
            </>
          )
        )}
        {view === "courses" && (
          <Courses
            onBack={() => setView("home")}
            onStartCourse={handleStartCourse}
          />
        )}
        {view === "learning" && (
          <Learning
            onBack={() => setView("courses")}
            courseId={selectedCourseId}
          />
        )}
        {view === "forum" && <Forum onBack={() => setView("home")} />}
        {view === "clubs" && <Clubs onBack={() => setView("home")} />}
        {view === "blog" && <Blog onBack={() => setView("home")} />}
        {view === "roadmaps" && <Roadmaps onBack={() => setView("home")} />}
        {view === "labs" && <Labs onBack={() => setView("home")} />}
        {view === "auth" && <Auth onBack={() => setView("home")} />}
      </main>
    </div>
  );
}
