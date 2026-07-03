import { RetirementRecord } from "../types";
import { formatAmount, formatDate } from "@/lib/utils/format";

export function RetirementCard({ record }: { record: RetirementRecord }) {
  return (
    <div className="glass-card p-5 rounded-xl border-amber-500/30 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h4 className="text-xl font-bold text-amber-400 mb-1">Official Retirement</h4>
          <p className="text-sm text-gray-400">Certificate #{record.id}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          🔥
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="border-b border-white/10 pb-4">
          <div className="text-3xl font-bold text-white mb-1">
            {formatAmount(record.amount)} <span className="text-lg text-gray-400 font-normal">tCO₂</span>
          </div>
          <div className="text-sm text-gray-400">Permanently Offset</div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Project</span>
            <span className="text-gray-200 font-medium">{record.project}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Vintage</span>
            <span className="text-gray-200">{record.vintage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Retired On</span>
            <span className="text-gray-200">{formatDate(record.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
