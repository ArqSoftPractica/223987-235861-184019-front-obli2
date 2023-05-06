import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import Alert from '@mui/material/Alert';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { logIn } from '../services/userService';
import {
  StyledButton,
  StyledLink,
  StyledHeader,
  StyledAvatar,
  formVariants
} from '../themes/componentsStyles';

const StyledContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const StyledForm = styled(Box)`
background-color: ${({ theme }) => theme.palette.background.paper};  
border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows[5]};
  padding: ${({ theme }) => theme.spacing(4)};
`;

function SignIn() {
  const theme = useTheme();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  
  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    const onSuccess = () => {
      setAlert({ type: 'success', message: 'Logged successfully' });
      setTimeout(() => {
        navigate('/home');        
      }, 3000);
    };
    const onError = (error) => {
      setAlert({ type: 'error', message: `An error occurred: ${error} ` });
    };
    logIn(data, onSuccess, onError);
  };

  return (
    <StyledContainer>
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <StyledForm theme={theme} component="form" onSubmit={handleSubmit(onSubmit)} className="form">
          <StyledAvatar theme={theme}>
            <LockOutlinedIcon />
          </StyledAvatar>
          <StyledHeader variant="h5">
            Sign In
          </StyledHeader>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            {...register('email')}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              )
            }}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            type={showPassword ? 'text' : 'password'}
            id="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                  >
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledButton
            theme={theme}
            type="submit"
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{ mt: 2, mb: 1 }}
            className="custom-button"
          >
            Sign In
          </StyledButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <StyledLink theme={theme} component={RouterLink} to="/signUp" variant="body2">
                Don't have an account? Sign Up
              </StyledLink>
            </Grid>
          </Grid>
          {alert.message && (
            <Alert severity={alert.type} sx={{ mt: 2 }}>
              {alert.message}
            </Alert>
          )}
        </StyledForm>
      </motion.div>
    </StyledContainer>
  );
}

export default SignIn;
