import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { stackClientApp } from './stack';
import LandingPage from './pages/landing';
import LayoutController from './components/LayoutController';
import DashboardLayout from './pages/dashboard/layout';
import Overview from './pages/dashboard/overview';
import Manage from './pages/dashboard/manage';
import ProjectDetails from './pages/dashboard/project-details';
import Loading from './pages/dashboard/loading';
import JWT_Testing from './pages/testing/auth-token';
import ProductTourEditor from './pages/editor/ProductTourEditor';
import TourViewer from './pages/viewer/TourViewer';


function HandlerRoutes() {
  const location = useLocation();
  return <StackHandler app={stackClientApp} location={location.pathname} fullPage />;
}

export default function App() {
  
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Routes>
              <Route path="/handler/*" element={<HandlerRoutes />} />
              <Route path="/" element={<LayoutController />}>
                <Route index element={<LandingPage />} />
                <Route path='about' />
                <Route path='pricing' />
              </Route>
              <Route path="/auth-testing" element={<JWT_Testing />} />
              <Route path="/projects" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="manage" element={<Manage />} />
                <Route path="details" element={<ProjectDetails />} />
                <Route path="loading" element={<Loading />} />
              </Route>
              <Route path="/editor" element={<ProductTourEditor />} />
              <Route path="/editor/:tourId" element={<ProductTourEditor />} /> {/* Route for editing existing tours */}
              <Route path="/view/:tourId" element={<TourViewer />} /> {/* Route for viewing public tours */}
            </Routes>
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
}
