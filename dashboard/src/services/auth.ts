import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/accounts';

export interface SignupData {
  username: string;
  password: string;
  wallet_address: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await axios.post(`${API_URL}/register/`, data);
  return response.data;
};

export const login = async (data: LoginData) => {
  try {
    console.log('Attempting login with:', { username: data.username });
    const response = await axios.post(`${API_URL}/login/`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Login response:', response.data);

    // Handle JWT tokens
    const { access, refresh } = response.data;
    if (access && refresh) {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify({
        username: data.username
      }));
      // Set the access token in axios defaults for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      return response.data;
    }

    console.error('Login response missing tokens:', response.data);
    throw new Error('Login failed: No tokens received');
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('transactionState');
  delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // Set the token in axios defaults if it exists
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  return false;
};