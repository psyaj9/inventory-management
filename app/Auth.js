import React, { useState } from 'react';
import { auth } from '@/firebase';
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Auth({ onAuthStateChanged }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleAuthAction = async () => {
    if (!validateInputs()) return;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthStateChanged(auth.currentUser);
    } catch (error) {
      console.error('Authentication Error', error);
      if (error.code === 'auth/user-not-found') {
        setEmailError('User not found');
      } else if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect password');
      } else {
      setEmailError('Authentication Error');
        setPasswordError('');
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
        error={!!emailError}
        helperText={emailError}
      />
      <TextField 
        variant="outlined" 
        label="Password" 
        type={showPassword ? 'text' : 'password'}
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        fullWidth 
        mb={2}
        error={!!passwordError}
        helperText={passwordError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
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
