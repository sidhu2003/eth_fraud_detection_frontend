import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Copy, ExternalLink } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { formatTimeAgo } from '../utils/formatters';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          {getStatusIcon()}
          <span
            className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor()} capitalize`}
          >
            {transaction.status}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTimeAgo(transaction.timestamp)}
          </span>
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          {transaction.amount} <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">ETH</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Receiver:</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {shortenAddress(transaction.receiverAddress)}
            </span>
            <button
              onClick={() => copyToClipboard(transaction.receiverAddress)}
              className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
              title="Copy address"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {transaction.hash && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Hash:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {shortenAddress(transaction.hash)}
              </span>
              <button
                onClick={() => copyToClipboard(transaction.hash!)}
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                title="Copy hash"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={`https://etherscan.io/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                title="View on Etherscan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {copied && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs animate-fadeOut">
          Copied!
        </div>
      )}
    </div>
  );
};

export default TransactionCard;