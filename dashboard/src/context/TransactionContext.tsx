import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction } from '../types/transaction';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
  };
}

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_STATE'; payload: TransactionState };

const calculateStats = (transactions: Transaction[]) => {
  return {
    total: transactions.length,
    successful: transactions.filter(tx => tx.status === 'success').length,
    failed: transactions.filter(tx => tx.status === 'failed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
  };
};

// Load initial state from localStorage or use default
const loadInitialState = (): TransactionState => {
  const savedState = localStorage.getItem('transactionState');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    return {
      ...parsed,
      stats: calculateStats(parsed.transactions),
    };
  }
  return {
    transactions: [],
    loading: false,
    error: null,
    stats: {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
    },
  };
};

const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
}>({
  state: loadInitialState(),
  dispatch: () => null,
  addTransaction: () => null,
  updateTransaction: () => null,
});

const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  let newState: TransactionState;

  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const updatedTransactions = [action.payload, ...state.transactions];
      newState = {
        ...state,
        transactions: updatedTransactions,
        stats: calculateStats(updatedTransactions),
      };
      break;
    }
    case 'UPDATE_TRANSACTION': {
      const updatedTransactions = state.transactions.map((tx) =>
        tx.id === action.payload.id ? action.payload : tx
      );
      newState = {
        ...state,
        transactions: updatedTransactions,
        stats: calculateStats(updatedTransactions),
      };
      break;
    }
    case 'SET_LOADING':
      newState = {
        ...state,
        loading: action.payload,
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
      };
      break;
    case 'LOAD_STATE':
      newState = action.payload;
      break;
    default:
      return state;
  }

  // Save to localStorage after each state change
  localStorage.setItem('transactionState', JSON.stringify(newState));
  return newState;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, loadInitialState());

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  return (
    <TransactionContext.Provider value={{ state, dispatch, addTransaction, updateTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);