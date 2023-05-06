import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  StyledButton,
  StyledHeader,
  formVariants
} from '../../themes/componentsStyles';
import { Grid } from '@mui/material';
import { createProvider } from '../../services/providerService'
import { isATokenValid } from '../../services/userService';
import { removeLocalStorage } from '../../utils';

const StyledContainer = styled(Box)`
  padding-block-end: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.paper}; 
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows[3]};
  padding: ${({ theme }) => theme.spacing(4)};
`;

function CreateProvider() {
  const theme = useTheme();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  
  useEffect(() => {
    const asyncFunction = async () =>{
        const tokenValid = await isATokenValid();
        if(!tokenValid){
          removeLocalStorage();
          navigate("/signIn");
        }
    }
    asyncFunction();
  }, []);

  const [alert, setAlert] = useState({ type: 'success', message: null });

  const onSubmit = (data) => {
    const onSuccess = () => {
      setAlert({ type: 'success', message: 'Provider created successfully' });
      setTimeout(() => {
        navigate('/providers');
      }, 3000);
    };
    const onError = (error) => {
      setAlert({ type: 'error', message: `An error occurred: ${error} ` });
    };
    createProvider(data, onSuccess, onError);
  };

  return (
    <>
    <div style={{"paddingLeft": '10vh', "paddingTop": '5vh'}}>
      <IconButton
        size="medium"
        color="inherit"
        onClick={() => {navigate('/providers')}}
      >
        <ArrowBackIosIcon fontSize='large' color='primary'  />
      </IconButton>
      </div>
    <StyledContainer>
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <StyledForm theme={theme} component="form" onSubmit={handleSubmit(onSubmit)} className="form">
          <StyledHeader variant="h5">
            Register Provider
          </StyledHeader>
          <Grid direction='row' container spacing={1}>
          <Grid container item sm={6} > 
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
          </Grid>
          <Grid container item sm={6} > 
          <TextField
            margin="normal"
            fullWidth
            id="Address"
            label="Address"
            name="address"
            autoFocus
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          </Grid>
            <Grid container item sm={6} >
                <TextField
                    margin="normal"
                    fullWidth
                    id="Email"
                    label="Email"
                    name="email"
                    autoFocus
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
            </Grid>
            <Grid container item sm={6} >
                <TextField
                    margin="normal"
                    fullWidth
                    id="Phone"
                    label="Phone"
                    name="phone"
                    autoFocus
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                />
            </Grid>
          </Grid>
          <StyledButton
            theme={theme}
            type='submit'
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{ mt: 3, mb: 2 }}
            className="custom-button"
          >
            Create Provider
          </StyledButton>
          {alert.message && (
            <Alert severity={alert.type} sx={{ mt: 2 }}>
              {alert.message}
            </Alert>
          )}
        </StyledForm>
      </motion.div>
    </StyledContainer>
    </>
  );
}

export default CreateProvider;