"use client";


import { ImpactCounter } from "@/features/retirement/components/ImpactCounter";

export default function AnalyticsPage() {
  return (

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Global Analytics</h1>
          <p className="text-gray-400">
            Network-wide metrics and carbon offset impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
             <ImpactCounter />
          </div>
          
          <div className="glass-card rounded-xl p-6 flex flex-col justify-center">
            <h3 className="text-lg font-medium text-gray-300 mb-6">Equivalencies</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Cars Taken Off Road (Yearly)</span>
                  <span className="text-white font-bold">~271,739</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full w-[70%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Trees Planted (10yr Growth)</span>
                  <span className="text-white font-bold">~20.8M</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Homes Powered (Yearly)</span>
                  <span className="text-white font-bold">~157,400</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mock Charts Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6 h-80 flex flex-col">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Issuance Trend</h3>
            <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-500">
               Line Chart Placeholder
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 h-80 flex flex-col">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Retirements by Methodology</h3>
            <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-gray-500">
               Bar Chart Placeholder
            </div>
          </div>
        </div>
      </div>

  );
}
