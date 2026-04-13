/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StartSection from "./components/StartSection";
import FeaturesChess from "./components/FeaturesChess";
import LearningPaths from "./components/LearningPaths";
import CtaFooter from "./components/CtaFooter";
import Courses from "./pages/Courses";
import Forum from "./pages/Forum";
import Clubs from "./pages/Clubs";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import { useAuth } from "./hooks/useAuth";

export type ViewState = "home" | "courses" | "forum" | "clubs" | "blog" | "auth";

export default function App() {
  const [view, setView] = useState<ViewState>("home");
  const { user, profile, logout } = useAuth();

  const navigateTo = (v: ViewState) => setView(v);

  return (
    <div className="bg-black min-h-screen selection:bg-white selection:text-black">
      {view !== "auth" && (
        <Navbar 
          onNavigate={navigateTo} 
          user={user} 
          profile={profile} 
          onLogout={logout} 
        />
      )}
      <main>
        {view === "home" && (
          <>
            <Hero />
            <div className="bg-black">
              <StartSection />
              <FeaturesChess />
              <LearningPaths />
              <CtaFooter />
            </div>
          </>
        )}
        {view === "courses" && <Courses onBack={() => setView("home")} />}
        {view === "forum" && <Forum />}
        {view === "clubs" && <Clubs onBack={() => setView("home")} />}
        {view === "blog" && <Blog onBack={() => setView("home")} />}
        {view === "auth" && <Auth onBack={() => setView("home")} />}
      </main>
    </div>
  );
}
