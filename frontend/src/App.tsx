import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation  } from 'react-router-dom';
import { stackClientApp } from './stack';
import LandingPage from './pages/landing';
import DashboardLayout from './pages/dashboard/layout';
import Overview from './pages/dashboard/overview';
import ProductTourEditor from './pages/editor/product-tour-editor';
import TourViewer from './pages/viewer/tour-viewer';
import Insights from './pages/dashboard/insights';
import Tours from './pages/dashboard/tours';
import LayoutController from './components/LayoutController';


function HandlerRoutes() {
  const location = useLocation();
  return <StackHandler app={stackClientApp} location={location.pathname} fullPage />;
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Router>
        <StackProvider app={stackClientApp}>
          <StackTheme>
                <Routes>
                  <Route path='/handler/*' element={<HandlerRoutes />} />

                  {/* Public Routes */}
                  <Route path="/" element={<LayoutController />}>
                  <Route index element={<LandingPage />} />
                  <Route path="about" />
                  <Route path="pricing" />
                  <Route path="/view/:tourId" element={<TourViewer />} />
                  </Route>
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/dashboard/overview" replace />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="tours" element={<Tours />} />
                    <Route path="insights" element={<Insights />} />
                  </Route>

                  {/* Editor Route */}
                  <Route path="/editor" element={<ProductTourEditor />} />


                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
          </StackTheme>
        </StackProvider>
      </Router>
    </Suspense>
  )
}


