import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Game from "@/pages/game";
import Leaderboard from "@/pages/leaderboard";
import Difficulty from "@/pages/difficulty";
import GameOver from "@/pages/game-over";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile";
import { UserAvatar } from "@/components/user-avatar";

// Layout component that includes the user avatar in the top right
function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="relative min-h-screen">
      {!isLoading && user && (
        <div className="absolute top-4 right-4 z-50">
          <UserAvatar user={user} />
        </div>
      )}
      {children}
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <ProtectedRoute path="/difficulty" component={Difficulty} />
        <ProtectedRoute path="/game" component={Game} />
        <ProtectedRoute path="/game-over" component={GameOver} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
