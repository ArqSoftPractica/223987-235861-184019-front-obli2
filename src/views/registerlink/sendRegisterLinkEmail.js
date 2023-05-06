import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendRegisterLink, getUsersCompany, isATokenValid } from '../../services/userService';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import Alert from '@mui/material/Alert';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  StyledButton,
  StyledHeader,
  StyledAvatar,
  formVariants
} from '../../themes/componentsStyles';
import { rolesToRegisterByLink } from './rolesRegisterLink'
import { removeLocalStorage } from '../../utils';

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

function SendRegisterLink() {
  const theme = useTheme();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    role: Yup.string().required('Role is required')
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    const asyncFunction = async () =>{
        const tokenValid = await isATokenValid();
        if(!tokenValid){
          removeLocalStorage();
          navigate("/signIn");
        }else{
            await fetchData();
        }              
    }
    asyncFunction();
  }, []);

  async function fetchData() {
    const company = await getUsersCompany();
    setCompanyName(company.name);
  }

  const onSubmit = (data) => {
    const onSuccess = () => {
      setAlert({ type: 'success', message: 'Link sent successfully' });
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    };
    const onError = (error) => {
      setAlert({ type: 'error', message: `An error occurred: ${error} ` });
    };
    sendRegisterLink(data, onSuccess, onError);
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
          <StyledHeader variant="h5" style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center' }}>
            Send Invite to join<br/>{companyName}
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
          <FormControl
           fullWidth
           error={!!errors.role}
                  helperText={errors.role?.message}>
              <InputLabel id="roleId">Role</InputLabel>
              <Select
                  labelId="roleId"
                  id="roleId"
                  label="Role"
                  defaultValue={''}
                  {...register('role')}
              >
                  {(Object.values(rolesToRegisterByLink)).map((p) => (
                      <MenuItem id="roleId" key={p} value={p}>{p}</MenuItem>
                  ))}
              </Select>
          </FormControl>
          <StyledButton
            theme={theme}
            type="submit"
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{ mt: 2, mb: 1 }}
            className="custom-button"
          >
            Send Invite
          </StyledButton>
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

export default SendRegisterLink;
