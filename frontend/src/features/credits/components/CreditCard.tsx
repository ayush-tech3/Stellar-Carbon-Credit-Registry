import { CreditBatch } from "../types";
import { formatAmount } from "@/lib/utils/format";

export function CreditCard({ credit }: { credit: CreditBatch }) {
  const total = Number(credit.amount) + Number(credit.retired);
  const percentRetired = total > 0 ? (Number(credit.retired) / total) * 100 : 0;

  return (
    <div className="glass-card p-5 rounded-xl border-emerald-500/20 hover:border-emerald-500/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-white">{credit.project}</h4>
          <p className="text-sm text-gray-400">ID: {credit.id} • Vintage: {credit.vintage}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${credit.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {credit.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Methodology</span>
          <span className="text-white">{credit.methodology}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Available</span>
            <span className="text-emerald-400 font-medium">{formatAmount(credit.amount)} tCO₂</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Retired</span>
            <span className="text-amber-400 font-medium">{formatAmount(credit.retired)} tCO₂</span>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div 
              className="bg-amber-400 h-2 rounded-full" 
              style={{ width: `${percentRetired}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
