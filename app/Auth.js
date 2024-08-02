// components/Auth.js
import { useState } from 'react';
import { auth } from '@/firebase';
import { Box, TextField, Button, Typography } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Auth({ onAuthStateChanged }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuthAction = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthStateChanged(auth.currentUser);
    } catch (error) {
      console.error('Authentication Error', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f5f5f5">
      <Typography variant="h4" mb={2}>{isRegistering ? 'Register' : 'Login'}</Typography>
      <TextField 
        variant="outlined" 
        label="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        fullWidth 
        mb={2}
      />
      <TextField 
        variant="outlined" 
        label="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        fullWidth 
        mb={2}
      />
      <Button 
        variant="contained" 
        onClick={handleAuthAction} 
        fullWidth 
        mb={2}
      >
        {isRegistering ? 'Register' : 'Login'}
      </Button>
      <Button 
        onClick={() => setIsRegistering(!isRegistering)} 
        fullWidth
      >
        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
      </Button>
    </Box>
  );
}
