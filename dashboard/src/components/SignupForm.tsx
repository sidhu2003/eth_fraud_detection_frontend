import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Loader2, User, Lock } from 'lucide-react';
import { signup } from '../services/auth';
import toast from 'react-hot-toast';

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    wallet_address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [addressError, setAddressError] = useState('');

  const validateEthereumAddress = (address: string) => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'wallet_address') {
      if (value && !validateEthereumAddress(value)) {
        setAddressError('Please enter a valid Ethereum address');
      } else {
        setAddressError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEthereumAddress(formData.wallet_address)) {
      setAddressError('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData);
      toast.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Wallet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="wallet_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wallet Address
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="wallet_address"
                name="wallet_address"
                required
                value={formData.wallet_address}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                  addressError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="0x..."
              />
            </div>
            {addressError && (
              <p className="mt-1 text-sm text-red-500">{addressError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !!addressError}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;