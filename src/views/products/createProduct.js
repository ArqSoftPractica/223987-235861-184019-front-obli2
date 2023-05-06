import React, { useEffect, useState } from 'react';
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
import {
  StyledButton,
  StyledHeader,
  formVariants
} from '../../themes/componentsStyles';
import { createProduct } from '../../services/productService'
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { imageUploadHandler } from '../../awsUtils';
import { removeLocalStorage } from '../../utils';
import { isATokenValid } from '../../services/userService';

const StyledIconButton= styled(IconButton)`
paddingLeft: 10%;
display: flex;
alignItems: center;
`;

const StyledContainer = styled(Box)`
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

function CreateProduct() {
  const theme = useTheme();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number()
      .typeError('Price must be a valid number')
      .required('Price is required'),
    stock: Yup.number()
      .typeError('Stock must be a valid number')
      .required('Stock is required'),
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
  const [file, setFile] = useState({ name: "Please select"});

  const onSubmit = async data => {
    const onSuccess = async () => {
      setAlert({ type: 'success', message: 'Product created successfully' });
      await imageUploadHandler(file);
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    };
    const onError = (error) => {
      setAlert({ type: 'error', message: `An error occurred: ${error} ` });
    };
    if( file.name == "Please select")
      file.name = null;
    createProduct(data, file.name, onSuccess, onError);
  };

  return (
    <>
    <div style={{"paddingLeft": '10vh', "paddingTop": '5vh'}}>
      <IconButton
        size="medium"
        color="inherit"
        onClick={() => {navigate('/products')}}
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
            Register Product
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
            id="price"
            label="Price"
            name="price"
            autoFocus
            {...register('price')}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            id="stock"
            label="Stock"
            name="stock"
            autoFocus
            {...register('stock')}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />
            <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoFocus
            {...register('description')}
          />
            
            <Stack direction="row" alignItems="center" spacing={2}>
            <StyledHeader variant="h8">
              Image
            </StyledHeader>
            <span>{file.name}</span><br />
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" id="productImage" onChange={(e) => { e.preventDefault(); setFile(e.target.files[0]); }} 
                />
                <PhotoCamera />
              </IconButton>
            </Stack>

          <StyledButton
            theme={theme}
            type='submit'
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{ mt: 3, mb: 2 }}
            className="custom-button"
          >
            Create Product
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

export default CreateProduct;
