import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, LogOut, LogIn } from "lucide-react";

export default function Home() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleLogin = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <div className="flex justify-end mb-2">
            {isLoading ? (
              <div className="text-sm flex items-center opacity-70">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Loading...
              </div>
            ) : user ? (
              <div className="flex flex-col items-end">
                <span className="text-sm opacity-80 mb-1">
                  Welcome, <span className="font-semibold">{user.username}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-xs flex items-center opacity-70 hover:opacity-100 transition-opacity"
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin h-3 w-3 mr-1" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-3 w-3 mr-1" />
                      Log out
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="text-sm flex items-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login / Register
              </button>
            )}
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold font-poppins mb-2 text-white">MindMath</h1>
            <p className="text-light opacity-80">Train your brain with math challenges</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <Link href="/difficulty">
              <button className="w-full bg-primary hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass">
                Start Quiz
              </button>
            </Link>
            
            <Link href="/leaderboard">
              <button className="w-full bg-secondary hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass">
                Leaderboard
              </button>
            </Link>
          </div>
          
          <div className="text-sm opacity-70">
            <p>Challenge yourself with mental math!</p>
            {!user && (
              <p className="mt-2 text-xs">
                <span className="opacity-90">Create an account to save your scores!</span>
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
