import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Define validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Login form handling
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form handling
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Submit handlers
  const handleLoginSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };
  
  const handleRegisterSubmit = async (data: RegisterFormData) => {
    // Omit confirmPassword when sending to API
    const { confirmPassword, ...registerData } = data;
    await registerMutation.mutateAsync(registerData);
  };
  
  // If user is already logged in, redirect to home
  if (user) {
    setLocation("/");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4">
      <div className="w-full max-w-md md:max-w-xl md:flex-1">
        <GlassCard className="md:mr-6">
          {isLogin ? (
            // Login Form
            <div>
              <h2 className="text-2xl font-bold font-poppins mb-6 text-white">Welcome Back</h2>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="username" className="block text-sm text-left mb-2 opacity-90">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      {...loginForm.register("username")}
                      className="w-full bg-white bg-opacity-20 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                      placeholder="Enter your username"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-red-300 text-xs mt-1 text-left">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm text-left mb-2 opacity-90">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      className="w-full bg-white bg-opacity-20 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                      placeholder="Enter your password"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-red-300 text-xs mt-1 text-left">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-primary hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass"
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Logging in...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </button>
                
                {loginMutation.isError && (
                  <p className="text-red-300 text-sm mt-4">
                    Login failed. Please check your credentials.
                  </p>
                )}
              </form>
              
              <div className="mt-6 text-sm opacity-80">
                <span>Don't have an account? </span>
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-accent hover:underline focus:outline-none"
                >
                  Sign Up
                </button>
              </div>
            </div>
          ) : (
            // Register Form
            <div>
              <h2 className="text-2xl font-bold font-poppins mb-6 text-white">Create Account</h2>
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="reg-username" className="block text-sm text-left mb-2 opacity-90">
                      Username
                    </label>
                    <input
                      id="reg-username"
                      type="text"
                      {...registerForm.register("username")}
                      className="w-full bg-white bg-opacity-20 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                      placeholder="Choose a username"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-red-300 text-xs mt-1 text-left">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="reg-password" className="block text-sm text-left mb-2 opacity-90">
                      Password
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      {...registerForm.register("password")}
                      className="w-full bg-white bg-opacity-20 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                      placeholder="Create a password"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-red-300 text-xs mt-1 text-left">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm text-left mb-2 opacity-90">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      {...registerForm.register("confirmPassword")}
                      className="w-full bg-white bg-opacity-20 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                      placeholder="Confirm your password"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-red-300 text-xs mt-1 text-left">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-primary hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass"
                >
                  {registerMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Creating Account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
                
                {registerMutation.isError && (
                  <p className="text-red-300 text-sm mt-4">
                    Registration failed. Please try a different username.
                  </p>
                )}
              </form>
              
              <div className="mt-6 text-sm opacity-80">
                <span>Already have an account? </span>
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-accent hover:underline focus:outline-none"
                >
                  Log In
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
      
      <div className="hidden md:block md:flex-1">
        <GlassCard className="mt-8 md:mt-0 md:ml-6 py-16">
          <div className="mb-6">
            <h1 className="text-4xl font-bold font-poppins mb-4 text-white">MindMath</h1>
            <p className="text-lg opacity-90 mb-8">Train your brain with challenging math problems</p>
            
            <div className="space-y-6 text-left px-4">
              <div className="flex items-start">
                <div className="bg-primary bg-opacity-30 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Track Your Progress</h3>
                  <p className="opacity-80">Keep track of your scores and see your improvement over time</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary bg-opacity-30 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Adaptive Difficulty</h3>
                  <p className="opacity-80">Questions get harder as you improve, keeping you challenged</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accent bg-opacity-30 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Time-Based Challenges</h3>
                  <p className="opacity-80">Race against the clock to test your mental speed</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}