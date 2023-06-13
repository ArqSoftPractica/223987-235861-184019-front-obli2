import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLoaderData, useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Stack from '@mui/material/Stack';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import {
  StyledHeader,
  formVariants
} from '../../themes/componentsStyles';
import { Grid } from '@mui/material';
import { getProduct, getSuscribeUserProduct, suscribeUserProduct, unsuscribeUserProduct } from '../../services/productService';
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

function ViewProduct() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [product, setProduct] = useState(null);
  const [userSubscribed, setUserSubscribed] = useState(false);
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

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    await getProduct(productId, (productResponse) => {
      const product = productResponse.data
      setFile({ name: productResponse.data.image });
      setProduct(product);
    }, (error) => setAlert({ type: 'error', message: error }));

    const response = await getSuscribeUserProduct(productId);
    setUserSubscribed(response);
  }

  const unsuscribeUserProductFunction = async () => {
    setAlert({ type: 'success', message: "Unsuscribe successfully" });
    await unsuscribeUserProduct(productId);
    const response = await getSuscribeUserProduct(productId);
    setUserSubscribed(response);
  }

  const suscribeUserProductFunction = async () => {
    setAlert({ type: 'success', message: "Suscribe successfully" });
    await suscribeUserProduct(productId);
    const response = await getSuscribeUserProduct(productId);
    setUserSubscribed(response);
  }

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
        <StyledForm theme={theme} component="form">
          <Grid direction='row' container spacing={1} justifyContent="flex-end">
            {!userSubscribed && 
              <IconButton aria-label="delete" size="medium" onClick={async () =>  await suscribeUserProductFunction()}>
                <SubscriptionsIcon fontSize="inherit" />
              </IconButton>
            }
            {userSubscribed && 
              <IconButton aria-label="delete" size="medium" onClick={async () =>  await unsuscribeUserProductFunction()}>
                <UnsubscribeIcon fontSize="inherit" />
              </IconButton>
            }
          </Grid>
          <StyledHeader variant="h5">
            View Product
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
                InputProps={{
                  readOnly: true,
                }}
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
                InputProps={{
                  readOnly: true,
                }}
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
                InputProps={{
                  readOnly: true,
                }}
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
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <Stack direction="row" alignItems="center" spacing={2}>
            <StyledHeader variant="h8">
              Image
            </StyledHeader>
            <span>{file.name}</span><br />
          </Stack>
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

export default ViewProduct;
