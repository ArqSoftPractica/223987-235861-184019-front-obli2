import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, Link as RouterLink } from 'react-router-dom';
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
import { getProvider, editProvider } from '../../services/providerService'
import { isATokenValid } from '../../services/userService';
import { removeLocalStorage } from '../../utils';

const StyledContainer = styled(Box)`
  paddingTop: 10vh;
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

export function providerLoader({ params }) {
  return params.providerId;
}

function EditProvider() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [provider, setProvider] = useState(null);
  const providerId = useLoaderData();

  const validationSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // address: Yup.string().required('Address is required'),
    // email: Yup.string().email('Email is invalid').required('Email is required'),
    // phone: Yup.string().required('Phone is required'),
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
        }else
          await fetchData()
    }
    asyncFunction();
  }, []);

  async function fetchData() {
    const providerResponse = await getProvider(providerId);
    const provider = providerResponse.data
    setProvider(provider);
  }

  const onSubmit = (data) => {
    if(!provider.name || !provider.address || !provider.email || !provider.phone ){
      !provider.phone && setAlert({ type: 'error', message: 'Phone is required and a valid phone' });
      !provider.email && setAlert({ type: 'error', message: 'Email is required and a valid email' });
      !provider.address && setAlert({ type: 'error', message: 'Address is required' });
      !provider.name && setAlert({ type: 'error', message: 'Name is required' });
    } else {
      const onSuccess = () => {
        setAlert({ type: 'success', message: 'Provicer edited successfully' });
        setTimeout(() => {
          navigate('/providers');
        }, 3000);
      };
      const onError = (error) => {
        setAlert({ type: 'error', message: `An error occurred: ${error} ` });
      };
      provider.providerId = provider.id;
      editProvider(provider, onSuccess, onError);
    }
  };

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setProvider(prevProvider => ({ ...prevProvider, name: newValue }));
  };
  const handleAddressChange = (event) => {
    const newValue = event.target.value;
    setProvider(prevProvider => ({ ...prevProvider, address: newValue }));
    };
    const handleEmailChange = (event) => {
        const newValue = event.target.value;
        setProvider(prevProvider => ({ ...prevProvider, email: newValue }));
    };
    const handlePhoneChange = (event) => {
        const newValue = event.target.value;
        setProvider(prevProvider => ({ ...prevProvider, phone: newValue }));
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
            Edit Provider
          </StyledHeader>
          <Grid direction='row' container spacing={1}>
            <Grid container item sm={6} >
              <b>Name</b>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                name="name"
                value={provider?.name}
                {...register('name', { onChange: handleNameChange })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid container item sm={6} >
              <b>Address</b>
              <TextField
                  margin="normal"
                  fullWidth
                  id="address"
                  name="address"
                  value={provider?.address}
                  {...register('address', { onChange: handleAddressChange })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
              />
            </Grid>
            <Grid container item sm={6} >
              <b>Email</b>
              <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  name="email"
                  value={provider?.email}
                  {...register('email', { onChange: handleEmailChange })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
              />
            </Grid>
            <Grid container item sm={6} >
              <b>Phone</b>
              <TextField
                  margin="normal"
                  fullWidth
                  id="phone"
                  name="phone"
                  value={provider?.phone}
                  {...register('phone', { onChange: handlePhoneChange })}
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
            Edit
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

export default EditProvider;
