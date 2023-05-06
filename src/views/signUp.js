import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createUser } from '../services/userService';
import Button from '@mui/material/Button';
import {
  StyledButton,
  StyledLink,
  StyledHeader,
  formVariants
} from '../themes/componentsStyles';
const SearchDateStylsButton = styled(Button)``;

const StyledContainer = styled(Box)`
  paddingTop: 10vh;
  padding-block-end: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Box)`
  &.form {
    max-width: 400px;
  }
  background-color: ${({ theme }) => theme.palette.background.paper}; 
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows[3]};
  padding: ${({ theme }) => theme.spacing(4)};
`;

function SignUp() {
  const theme = useTheme();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    companyName: Yup.string().required('Company name is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 8 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [goToSignInAllowed, setGoToSignInAllowed] = useState(false);

  const onSubmit = (data) => {
    const onSuccess = (response) => {
      let message = 'User created successfully'
      if (response.data.companyApiKey) {
        message += `\n\nThis is your API_KEY:\n\n${response.data.companyApiKey}\n\nPlease copy it and store it in a safe place.\nIt will allow you to do requests on our public API.`
      }
      setAlert({ type: 'success', message: message });
      setGoToSignInAllowed(true)
    };
    const onError = (error) => {
      setGoToSignInAllowed(false)
      setAlert({ type: 'error', message: `An error occurred: ${error} ` });
    };
    createUser(data, onSuccess, onError);
  };

  let navigateToSignIn = () => {
    navigate('/signIn');
  }

  return (
    <StyledContainer>
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <StyledForm theme={theme} component="form" onSubmit={handleSubmit(onSubmit)} className="form">
          <StyledHeader variant="h5">
            Sign Up
          </StyledHeader>
          <TextField
            margin="normal"
            fullWidth
            id="Name"
            label="Name"
            name="name"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
           <TextField
            margin="normal"
            fullWidth
            id="companyName"
            label="Company Name"
            name="companyName"
            autoFocus
            {...register('companyName')}
            error={!!errors.companyName}
            helperText={errors.companyName?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
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
                  />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
                  />
                </InputAdornment>
              ),
            }}
          />
          <StyledButton
            theme={theme}
            type='submit'
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{ mt: 3, mb: 2 }}
            className="custom-button"
          >
            Sign Up
          </StyledButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <StyledLink theme={theme} component={RouterLink} to="/signIn" variant="body2">
                Already have an account? Sign In
              </StyledLink>
            </Grid>
          </Grid>
          {alert.message && (
            <Alert severity={alert.type} sx={{ mt: 2 }}>
              {alert.message}
            </Alert>
          )}
          {goToSignInAllowed ? (
              <SearchDateStylsButton
                variant="contained"
                sx={{ width: 175, height: 40, margin: '20px 0px 20px 0px'}}
                onClick={() => navigateToSignIn()}>Go To Sign In</SearchDateStylsButton>
          ) : null}
        </StyledForm>
      </motion.div>
    </StyledContainer>
  );
}

export default SignUp;
