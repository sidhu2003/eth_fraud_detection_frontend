import axios from 'axios';
import { Transaction } from '../types/transaction';
import toast from 'react-hot-toast';

// Mock API for demonstration
export const sendTransaction = async (
  amount: number,
  receiverAddress: string,
  transactionId: string
): Promise<Transaction> => {
  // Create initial transaction object
  const transaction: Transaction = {
    id: transactionId,
    amount,
    receiverAddress,
    timestamp: Date.now(),
    status: 'pending'
  };

  // Simulate API call with address verification
  return new Promise((resolve, reject) => {
    const isScam = receiverAddress.toLowerCase().includes('0x423');
    const processingTime = isScam ? 2000 : 3000;

    setTimeout(() => {
      if (isScam) {
        transaction.status = 'failed';
        reject(new Error('Suspicious wallet address detected'));
      } else {
        transaction.status = 'success';
        transaction.hash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        resolve(transaction);
      }
    }, processingTime);
  });
};

// Mock wallet address verification
export const checkWalletAddress = async (address: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!address.toLowerCase().includes('0x423'));
    }, 1000);
  });
};

// Mock transaction statistics
export const getTransactionStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total_transactions: 15,
        fraudulent_transactions: 4,
        legitimate_transactions: 11,
      });
    }, 1000);
  });
};