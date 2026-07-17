import { TrackedTransaction } from "../types";
import { getExplorerUrl } from "@/lib/stellar/contracts";
import { formatDate, formatTxHash } from "@/lib/utils/format";
import { CheckCircle2, Clock, XCircle, ExternalLink, RefreshCw } from "lucide-react";

export function TransactionCard({ transaction }: { transaction: TrackedTransaction }) {
  const getStatusConfig = () => {
    switch (transaction.status) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-500',
          label: 'Confirmed'
        };
      case 'processing':
        return {
          icon: <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />,
          bg: 'bg-blue-500/10',
          text: 'text-blue-500',
          label: 'Processing'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          label: 'Failed'
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          bg: 'bg-amber-500/10',
          text: 'text-amber-500',
          label: 'Pending Signature'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
      <div className={`p-3 rounded-full ${config.bg}`}>
        {config.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-200 capitalize">
          {transaction.method.replace(/_/g, ' ')}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(transaction.timestamp / 1000)}
          </span>
        </div>
        {transaction.error && (
          <p className="text-xs text-red-400 mt-1 truncate">{transaction.error}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {transaction.hash && (
          <a 
            href={getExplorerUrl('tx', transaction.hash)} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 bg-black/40 px-3 py-1.5 rounded-lg transition-colors border border-white/5 hover:border-emerald-500/30"
          >
            {formatTxHash(transaction.hash)}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
