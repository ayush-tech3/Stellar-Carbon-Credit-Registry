"use client";

import { useEventStream } from "../hooks/use-event-stream";
import { EventCard } from "./EventCard";
import { ActivityEvent, EventType } from "../types";
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Activity } from "lucide-react";

export function ActivityFeed() {
  const { data: events, isLoading, isError } = useEventStream();
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  const filteredEvents = events?.filter(e => filter === 'all' || e.type === filter) || [];

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow"></div>
          <h3 className="font-semibold text-white">Live Activity</h3>
        </div>
        
        <select 
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-emerald-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All Events</option>
          <option value="issued">Issuance</option>
          <option value="transferred">Transfers</option>
          <option value="retired">Retirements</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        
        {!isLoading && filteredEvents.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <EmptyState 
              icon={Activity} 
              title="No activity yet" 
              description="Waiting for new blockchain events..." 
            />
          </div>
        )}

        {!isLoading && filteredEvents.map((event) => (
          <EventCard key={`${event.txHash}-${event.id}`} event={event} />
        ))}
      </div>
    </div>
  );
}
