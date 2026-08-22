"use client";

import { useEffect, useState } from "react";
import { Analytics, type AppMetrics, type AnalyticsEvent } from "@/lib/utils/analytics";
import { useFeedbackStore, type FeedbackEntry } from "@/stores/feedback-store";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Wallet,
  Zap,
  AlertTriangle,
  Clock,
  Star,
  MessageSquare,
  BarChart3,
} from "lucide-react";

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = "emerald",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className={`glass-card rounded-xl p-5 border ${c.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{title}</span>
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.text}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {trendLabel && (
        <div className="flex items-center gap-1 mt-2 text-xs">
          {trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
          {trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-400" />}
          <span className={trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-gray-400"}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}

function categoryColor(cat: AnalyticsEvent["category"]): string {
  switch (cat) {
    case "page_view":
      return "text-blue-400 bg-blue-500/10";
    case "wallet":
      return "text-emerald-400 bg-emerald-500/10";
    case "transaction":
      return "text-purple-400 bg-purple-500/10";
    case "user_action":
      return "text-teal-400 bg-teal-500/10";
    case "error":
      return "text-red-400 bg-red-500/10";
    case "performance":
      return "text-amber-400 bg-amber-500/10";
    default:
      return "text-gray-400 bg-gray-500/10";
  }
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<AppMetrics | null>(null);
  const { entries: feedbackEntries } = useFeedbackStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMetrics(Analytics.getMetrics());
    // Refresh metrics every 5 seconds
    const interval = setInterval(() => {
      setMetrics(Analytics.getMetrics());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const recentEvents = [...metrics.eventLog].reverse().slice(0, 50);
  const successRate =
    metrics.totalTransactions > 0
      ? Math.round((metrics.successfulTransactions / metrics.totalTransactions) * 100)
      : 100;

  const avgRating =
    feedbackEntries.length > 0
      ? (feedbackEntries.reduce((sum, e) => sum + e.rating, 0) / feedbackEntries.length).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            Monitoring Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time application health, analytics, and user feedback.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Page Views"
          value={metrics.totalPageViews}
          icon={Eye}
          color="blue"
          trendLabel="All time"
          trend="neutral"
        />
        <MetricCard
          title="Unique Wallets"
          value={metrics.uniqueWalletConnections}
          icon={Wallet}
          color="emerald"
          trendLabel={`${metrics.walletAddresses.length} tracked`}
          trend="up"
        />
        <MetricCard
          title="Transactions"
          value={metrics.totalTransactions}
          icon={Zap}
          color="purple"
          trendLabel={`${successRate}% success`}
          trend={successRate >= 80 ? "up" : "down"}
        />
        <MetricCard
          title="Errors"
          value={metrics.errorCount}
          icon={AlertTriangle}
          color="red"
          trendLabel="Total tracked"
          trend={metrics.errorCount > 0 ? "down" : "neutral"}
        />
        <MetricCard
          title="Avg Load Time"
          value={metrics.avgPageLoadMs > 0 ? `${Math.round(metrics.avgPageLoadMs)}ms` : "N/A"}
          icon={Clock}
          color="amber"
          trendLabel={metrics.avgPageLoadMs < 1000 ? "Good" : "Slow"}
          trend={metrics.avgPageLoadMs < 1000 ? "up" : "down"}
        />
        <MetricCard
          title="Feedback Rating"
          value={avgRating}
          icon={Star}
          color="amber"
          trendLabel={`${feedbackEntries.length} responses`}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Log */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Event Log
            </h2>
            <span className="text-xs text-gray-500">{recentEvents.length} events</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {recentEvents.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No events tracked yet. Navigate the app to generate analytics.</p>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${categoryColor(
                      event.category
                    )}`}
                  >
                    {event.category.replace("_", " ")}
                  </span>
                  <span className="text-sm text-gray-300 flex-1 truncate">
                    {event.action}
                    {event.label ? ` — ${event.label}` : ""}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Feedback */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              User Feedback
            </h2>
            <span className="text-xs text-gray-500">{feedbackEntries.length} entries</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {feedbackEntries.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No feedback collected yet.</p>
            ) : (
              feedbackEntries.map((entry: FeedbackEntry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= entry.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {entry.comment && (
                    <p className="text-sm text-gray-300">{entry.comment}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{entry.page}</span>
                    {entry.walletAddress && (
                      <span className="font-mono">
                        {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
