import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { TransactionFormData } from '../types/transaction';
import { useTransactions } from '../context/TransactionContext';
import { sendTransaction } from '../services/api';
import toast from 'react-hot-toast';

const TransactionForm: React.FC = () => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    receiverAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState('');

  const validateEthereumAddress = (address: string) => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'receiverAddress') {
      if (value && !validateEthereumAddress(value)) {
        setAddressError('Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters)');
      } else {
        setAddressError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.receiverAddress) {
      return;
    }

    if (!validateEthereumAddress(formData.receiverAddress)) {
      setAddressError('Please enter a valid Ethereum address');
      return;
    }

    setIsSubmitting(true);
    
    // Generate transaction ID once
    const transactionId = Math.random().toString(36).substring(2, 15);
    
    try {
      // Create a pending transaction first to show immediate feedback
      const initialTransaction = {
        id: transactionId,
        amount: parseFloat(formData.amount),
        receiverAddress: formData.receiverAddress,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(initialTransaction);
      
      // Process the transaction
      const finalTransaction = await sendTransaction(
        parseFloat(formData.amount),
        formData.receiverAddress,
        transactionId
      );
      
      // Update with final status
      updateTransaction(finalTransaction);
      toast.success('Transaction completed successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        receiverAddress: '',
      });
    } catch (error) {
      // Update the same transaction with failed status
      updateTransaction({
        id: transactionId,
        amount: parseFloat(formData.amount),
        receiverAddress: formData.receiverAddress,
        timestamp: Date.now(),
        status: 'failed'
      });
      
      toast.error(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.000001"
              min="0.000001"
              disabled={isSubmitting}
              className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">ETH</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="receiverAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Receiver Address
          </label>
          <input
            type="text"
            id="receiverAddress"
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
            placeholder="0x..."
            disabled={isSubmitting}
            className={`block w-full px-4 py-2 rounded-md border ${
              addressError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            required
          />
          {addressError && (
            <p className="mt-1 text-sm text-red-500">{addressError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!addressError}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            <>
              Send Transaction
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;