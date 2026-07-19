/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    absoluteStrokeWidth?: boolean
  }
  export type LucideIcon = FC<LucideProps>
  
  // This allows any import from lucide-react to be typed as any
  // but we still export LucideIcon so it can be used as a type
  const _default: any;
  export default _default;
  export const Leaf: any;
  export const Award: any;
  export const ArrowRightLeft: any;
  export const Flame: any;
  export const Coins: any;
  export const RefreshCw: any;
  export const Activity: any;
  export const ExternalLink: any;
  export const Copy: any;
  export const CheckCircle2: any;
  export const XCircle: any;
  export const AlertCircle: any;
  export const Wallet: any;
  export const Settings: any;
  export const LogOut: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const Menu: any;
  export const X: any;
  export const Info: any;
  export const Loader2: any;
  export const Trash2: any;
  export const Plus: any;
  export const BarChart3: any;
  export const BarChart: any;
  export const LineChart: any;
  export const MoreHorizontal: any;
  export const FileText: any;
  export const ArrowRight: any;
  export const ShieldCheck: any;
  export const Globe: any;
  export const Zap: any;
  export const LayoutDashboard: any;
  export const History: any;
  export const UserPlus: any;
  export const UserMinus: any;
  export const Clock: any;
}
