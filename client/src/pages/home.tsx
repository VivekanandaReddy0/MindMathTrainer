import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Brain, 
  Trophy, 
  Users, 
  Calculator, 
  Zap, 
  Timer, 
  TrendingUp,
  PlayCircle,
  Medal,
  LogIn
} from "lucide-react";
import { AnimatedNumber } from "@/components/animated-numbers";
import { FloatingSymbols } from "@/components/floating-symbols";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedText } from "@/components/animated-text";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Fetch leaderboard data
  const { data: leaderboardData } = useQuery({
    queryKey: ['/api/leaderboard/top'],
  });

  useEffect(() => {
    // Set demo stats (could be replaced with real API stats in the future)
    const interval = setInterval(() => {
      setTotalQuestions(Math.floor(Math.random() * 200) + 10000);
      setTotalUsers(Math.floor(Math.random() * 20) + 750);
    }, 60000); // Update every minute

    // Initial values
    setTotalQuestions(10428);
    setTotalUsers(762);

    // Find highest score from leaderboard
    if (leaderboardData && leaderboardData.length > 0) {
      const maxScore = Math.max(...leaderboardData.map((entry: any) => entry.score));
      setHighScore(maxScore);
    } else {
      setHighScore(580);
    }

    return () => clearInterval(interval);
  }, [leaderboardData]);

  const handleLogin = () => {
    setLocation("/auth");
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const statsCard = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <FloatingSymbols />
      
      {/* Hero section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 py-20 z-10">
        <motion.div 
          className="md:w-1/2 text-center md:text-left mb-10 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <AnimatedText 
              text="MindMath"
              className="text-5xl md:text-7xl text-white font-poppins tracking-tight"
            />
            <AnimatedText 
              text="Brain Training App" 
              className="text-3xl md:text-4xl text-accent font-poppins"
              delay={0.5}
            />
          </div>
          
          <motion.p 
            className="text-lg text-gray-300 mb-8 max-w-md mx-auto md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Challenge your mental math skills with our adaptive difficulty system. Beat your high score and climb the leaderboard!
          </motion.p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Link href={user ? "/difficulty" : "/auth"}>
              <AnimatedButton 
                variant="primary" 
                className="sm:max-w-[200px]"
                icon={<PlayCircle size={20} />}
                delay={0.9}
              >
                Start Challenge
              </AnimatedButton>
            </Link>
            <Link href="/leaderboard">
              <AnimatedButton 
                variant="secondary" 
                className="sm:max-w-[200px]"
                icon={<Trophy size={20} />}
                delay={1.1}
              >
                Leaderboard
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="w-full max-w-md">
            <div className="text-center p-2">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Brain className="w-16 h-16 text-accent mx-auto mb-2" />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Ready For a Challenge?</h2>
                <p className="text-gray-300 mb-6">
                  Solve equations, improve your mental calculation speed, and track your progress over time.
                </p>
              </motion.div>
              
              {!user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center mx-auto px-6 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Sign in to save your scores</span>
                  </button>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
      
      {/* Stats section */}
      <motion.div 
        className="w-full bg-black bg-opacity-30 py-16 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            variants={statsCard}
          >
            Mind Math in Numbers
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedNumber value={totalQuestions} title="Questions Answered" icon={<Calculator />} />
            <AnimatedNumber value={totalUsers} title="Active Users" icon={<Users />} />
            <AnimatedNumber value={highScore} title="Top Score" icon={<Trophy />} />
          </div>
        </div>
      </motion.div>
      
      {/* Features section */}
      <div className="max-w-7xl mx-auto px-4 py-20 z-10">
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Zap className="text-accent mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold text-white mb-2">Adaptive Difficulty</h3>
            <p className="text-gray-300">
              The game adapts to your skill level, automatically increasing or decreasing difficulty based on your performance.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Timer className="text-accent mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold text-white mb-2">Timed Challenges</h3>
            <p className="text-gray-300">
              Race against the clock to solve equations. Quicker answers earn more points, testing both accuracy and speed.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <TrendingUp className="text-accent mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-300">
              Track your scores, see your improvement over time, and compete with other players on the global leaderboard.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* CTA section */}
      <motion.div 
        className="w-full bg-gradient-to-r from-primary/30 to-accent/30 py-16 z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Medal className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Train Your Brain?</h2>
            <p className="text-gray-300 mb-8">
              Start your daily mental workout with MindMath and see how high you can score!
            </p>
          </motion.div>
          
          <Link href={user ? "/difficulty" : "/auth"}>
            <AnimatedButton 
              variant="primary" 
              className="max-w-xs mx-auto"
              icon={<PlayCircle size={20} />}
            >
              {user ? "Start Challenge" : "Sign Up & Play Now"}
            </AnimatedButton>
          </Link>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="w-full bg-black bg-opacity-50 py-8 z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MindMath Brain Training App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
