"use client";

import { ActivityFeed } from "@/features/activity/components/ActivityFeed";


export default function ActivityPage() {
  return (

      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white">Network Activity</h1>
          <p className="text-gray-400">
            Real-time feed of all CarbonTrack smart contract events on the Stellar network.
          </p>
        </div>
        
        <ActivityFeed />
      </div>

  );
}
