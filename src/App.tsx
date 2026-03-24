import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import { PerformanceProvider } from "./context/PerformanceContext";

// Defer CV, ProjectDetail, and NotFound — not needed on initial load
const CV = lazy(() => import("./pages/CV"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <PerformanceProvider>
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<Suspense fallback={null}><CV /></Suspense>} />
        <Route path="/projects/:slug" element={<Suspense fallback={null}><ProjectDetail /></Suspense>} />
        <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  </BrowserRouter>
  </PerformanceProvider>
);

export default App;
