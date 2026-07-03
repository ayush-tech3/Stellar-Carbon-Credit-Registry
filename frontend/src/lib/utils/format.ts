export function formatAddress(address: string | null | undefined): string {
  if (!address) return '';
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

export function formatAmount(amount: number | bigint | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(timestamp: number | string): string {
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTons(tons: number | bigint | string): string {
  return `${formatAmount(tons)} tons CO₂`;
}

export function formatTxHash(hash: string): string {
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
}
