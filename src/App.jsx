import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import CustomCursor from './components/CustomCursor.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import HashScrollHandler from './components/HashScrollHandler.jsx'
import PageTransition from './components/PageTransition.jsx'

// Home loads eagerly — it's the overwhelmingly common entry point and
// shouldn't wait on a lazy-chunk round-trip. Every other page is
// code-split: previously all 8 pages were bundled into one ~564KB chunk
// that loaded in full on every visit regardless of which single route was
// requested. Suspense's fallback is `null` rather than a spinner — routes
// only suspend on the initial JS chunk fetch (near-instant after the first
// visit, since the browser caches it), and PageTransition's own fade-in
// already covers the visual entrance, so a spinner would just flash.
import Home from './pages/Home.jsx'
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'))
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/services/:slug"
          element={
            <PageTransition>
              <ServiceDetail />
            </PageTransition>
          }
        />
        <Route
          path="/work/:slug"
          element={
            <PageTransition>
              <ProjectDetail />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path="/faq"
          element={
            <PageTransition>
              <FAQPage />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <PrivacyPage />
            </PageTransition>
          }
        />
        <Route
          path="/terms"
          element={
            <PageTransition>
              <TermsPage />
            </PageTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="overflow-x-clip bg-[#FBF7EF]">
        <CustomCursor />
        <ScrollToTop />
        <HashScrollHandler />
        <Nav />

        <AnimatedRoutes />

        <Footer />
      </div>
    </BrowserRouter>
  )
}