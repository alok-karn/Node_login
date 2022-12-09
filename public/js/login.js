import axios from 'axios';

export const login = async (email, passwrod) => {
  try {
    const res = await axios.post('/auth/login', { email, passwrod });
  } catch (error) {}
};
