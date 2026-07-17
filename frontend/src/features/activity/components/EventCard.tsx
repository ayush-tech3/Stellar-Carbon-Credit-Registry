import { ActivityEvent } from "../types";
import { getExplorerUrl } from "@/lib/stellar/contracts";
import { formatTxHash } from "@/lib/utils/format";
import { motion } from "framer-motion";
import { ArrowRightLeft, Flame, Leaf, UserPlus, UserMinus, ExternalLink } from "lucide-react";

export function EventCard({ event }: { event: ActivityEvent }) {
  const getEventDetails = () => {
    switch (event.type) {
      case 'issued':
        return {
          title: 'Credits Issued',
          icon: <Leaf className="w-4 h-4 text-emerald-500" />,
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20'
        };
      case 'transferred':
        return {
          title: 'Credits Transferred',
          icon: <ArrowRightLeft className="w-4 h-4 text-blue-500" />,
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20'
        };
      case 'retired':
        return {
          title: 'Credits Retired',
          icon: <Flame className="w-4 h-4 text-amber-500" />,
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20'
        };
      case 'issuer_added':
        return {
          title: 'Issuer Added',
          icon: <UserPlus className="w-4 h-4 text-purple-500" />,
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20'
        };
      case 'issuer_removed':
        return {
          title: 'Issuer Removed',
          icon: <UserMinus className="w-4 h-4 text-red-500" />,
          bg: 'bg-red-500/10',
          border: 'border-red-500/20'
        };
      default:
        return {
          title: 'Unknown Event',
          icon: <Leaf className="w-4 h-4 text-gray-500" />,
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/20'
        };
    }
  };

  const details = getEventDetails();
  const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // Approximate

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg border ${details.border} bg-white/5 hover:bg-white/10 transition-colors flex items-start gap-3`}
    >
      <div className={`p-2 rounded-full ${details.bg}`}>
        {details.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="font-medium text-sm text-gray-200">{details.title}</h4>
          <span className="text-xs text-gray-500">{timeStr}</span>
        </div>
        
        <p className="text-xs text-gray-400 truncate">
          Tx: {formatTxHash(event.txHash)}
        </p>
      </div>
      
      <a 
        href={getExplorerUrl('tx', event.txHash)} 
        target="_blank" 
        rel="noreferrer"
        className="text-gray-500 hover:text-emerald-400 p-1"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
}
