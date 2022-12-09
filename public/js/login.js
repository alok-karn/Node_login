import axios from 'axios';

export const login = async (email, password) => {
  try {
    const res = await axios.post('/auth/login', { email, password });
  } catch (error) {}
};
