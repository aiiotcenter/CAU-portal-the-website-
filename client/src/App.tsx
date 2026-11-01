import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// CMS Dashboard Pages
import OverviewPage from "./pages/dashboard/OverviewPage";
import ProgramsPage from "./pages/dashboard/ProgramsPage";
import FacultiesPage from "./pages/dashboard/FacultiesPage";
import NewsPage from "./pages/dashboard/NewsPage";
import LeadsPage from "./pages/dashboard/LeadsPage";
import AIAssistantPage from "./pages/dashboard/AIAssistantPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import LoginPage from "./pages/dashboard/LoginPage";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path={"/"} component={Home} />

      {/* University & CMS Dashboard Routes */}
      <Route path={"/dashboard"} component={OverviewPage} />
      <Route path={"/dashboard/programs"} component={ProgramsPage} />
      <Route path={"/dashboard/faculties"} component={FacultiesPage} />
      <Route path={"/dashboard/news"} component={NewsPage} />
      <Route path={"/dashboard/leads"} component={LeadsPage} />
      <Route path={"/dashboard/ai"} component={AIAssistantPage} />
      <Route path={"/dashboard/settings"} component={SettingsPage} />
      <Route path={"/dashboard/login"} component={LoginPage} />

      {/* Admin aliases */}
      <Route path={"/admin"}>
        {() => <Redirect to="/dashboard" />}
      </Route>
      <Route path={"/admin/login"}>
        {() => <Redirect to="/dashboard/login" />}
      </Route>

      {/* Fallback routes */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

