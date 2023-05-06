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
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonBase from '@mui/material/ButtonBase';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import {
  StyledButton,
  StyledHeader,
  formVariants
} from '../../themes/componentsStyles';
import { Grid } from '@mui/material';
import { getProduct, editProduct } from '../../services/productService'
import { imageUploadHandler } from '../../awsUtils';
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

export function productLoader({ params }) {
  return params.productId;
}

function EditProduct() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [product, setProduct] = useState(null);
  const productId = useLoaderData();
  const [file, setFile] = useState({ name: "Please select"});

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

  const validationSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // price: Yup.number()
    //   .typeError('Price must be a valid number')
    //   .required('Price is required'),
    // stock: Yup.number()
    //   .typeError('Stock must be a valid number')
    //   .required('Stock is required'),
    // description: Yup.string().required('Description is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    await getProduct(productId, (productResponse) => {
      const product = productResponse.data
      setFile({ name: productResponse.data.image });
      setProduct(product);
    }, (error) => setAlert({ type: 'error', message: error }));
  }

  const onSubmit = async (data) => {
    if(!product.name || !product.price || !product.stock ){
      !product.stock && setAlert({ type: 'error', message: 'Stock is required and a valid number' });
      !product.price && setAlert({ type: 'error', message: 'Price is required and a valid number' });
      !product.name && setAlert({ type: 'error', message: 'Name is required' });
    } else {
      const onSuccess = async () => {
        setAlert({ type: 'success', message: 'Product edited successfully' });
        await imageUploadHandler(file);
        setTimeout(() => {
          navigate('/products');
        }, 3000);
      }
      const onError = (error) => {
        setAlert({ type: 'error', message: `An error occurred: ${error} ` });
      };
      product.productId = product.id;
      if( file.name == "Please select")
        file.name = null;
      await editProduct(product, file.name, onSuccess, onError);
    };
  };

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setProduct(prevProduct => ({ ...prevProduct, name: newValue }));
  };

  const handlePriceChange = (event) => {
    const newValue = event.target.value;
    setProduct(prevProduct => ({ ...prevProduct, price: newValue }));
  };

  const handleStockChange = (event) => {
    const newValue = event.target.value;
    setProduct(prevProduct => ({ ...prevProduct, stock: newValue }));
  };

  const handleDescriptionChange = (event) => {
    const newValue = event.target.value;
    setProduct(prevProduct => ({ ...prevProduct, description: newValue }));
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
            Edit Product
          </StyledHeader>
          <Grid direction='row' container spacing={1}>
            <Grid container item sm={6} >
              <b>Name</b>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                name="name"
                value={product?.name}
                {...register('name', { onChange: handleNameChange })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid container item sm={6} > 
              <b>Price</b>
              <TextField
                margin="normal"
                fullWidth
                id="price"
                name="price"
                value={product?.price}
                {...register('price', { onChange: handlePriceChange })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid container item sm={6} > 
              <b>Stock</b>
              <TextField
                margin="normal"
                fullWidth
                id="stock"
                name="stock"
                autoFocus
                value={product?.stock}
                {...register('stock', { onChange: handleStockChange })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid container item sm={6} > 
              <b>Description</b>
              <TextField
                margin="normal"
                fullWidth
                id="description"
                focused={false}
                name="description"
                value={product?.description}
                {...register('description', { onChange: handleDescriptionChange })}
              />
            </Grid>
          </Grid>
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

export default EditProduct;
