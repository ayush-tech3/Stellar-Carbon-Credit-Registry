"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ToastContainer } from "@/components/ui/toast";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";
import { Analytics } from "@/lib/utils/analytics";
import { ThreeDBackground } from "@/components/shared/ThreeDBackground";

function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    Analytics.trackPageView(pathname);
  }, [pathname]);

  // Track Web Vitals on mount
  useEffect(() => {
    const start = performance.now();
    const handleLoad = () => {
      const loadTime = performance.now() - start;
      Analytics.trackPerformance(loadTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThreeDBackground />
      <AnalyticsTracker />
      {children}
      <ToastContainer />
      <FeedbackWidget />
    </ErrorBoundary>
  );
}
