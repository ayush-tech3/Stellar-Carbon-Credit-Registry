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

export function handleContractError(error: any): string {
  console.error("Contract error:", error);
  if (error instanceof AppError) return error.userMessage;
  if (error?.message) return error.message;
  return "An unexpected error occurred while interacting with the smart contract.";
}

export function isUserRejection(error: any): boolean {
  return error?.message?.includes('User declined') || error?.message?.includes('User rejected');
}
