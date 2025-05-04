export interface Transaction {
  id: string;
  amount: number;
  receiverAddress: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  hash?: string;
}

export interface TransactionFormData {
  amount: string;
  receiverAddress: string;
}