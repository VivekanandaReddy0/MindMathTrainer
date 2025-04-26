import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
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
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
