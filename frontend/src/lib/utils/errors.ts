export class AppError extends Error {
  code: string;
  userMessage: string;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', userMessage?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage || message;
  }
}

export function handleContractError(error: unknown): string {
  console.error("Contract error:", error);
  if (error instanceof AppError) return error.userMessage;
  if (error && typeof error === 'object' && 'message' in error) return (error as any).message;
  return "An unexpected error occurred while interacting with the smart contract.";
}

export function isUserRejection(error: unknown): boolean {
  return (error as any)?.message?.includes('User declined') || (error as any)?.message?.includes('User rejected');
}
