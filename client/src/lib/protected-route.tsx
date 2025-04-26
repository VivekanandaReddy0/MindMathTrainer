import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  // Create wrapper components to handle different states
  const LoadingComponent = () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );

  const RedirectComponent = () => <Redirect to="/auth" />;

  if (isLoading) {
    return <Route path={path} component={LoadingComponent} />;
  }

  if (!user) {
    return <Route path={path} component={RedirectComponent} />;
  }

  return <Route path={path} component={Component} />;
}