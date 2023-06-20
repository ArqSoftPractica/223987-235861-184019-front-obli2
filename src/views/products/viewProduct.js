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
import InventoryIcon from '@mui/icons-material/Inventory';
import {
  StyledHeader,
  formVariants
} from '../../themes/componentsStyles';
import { Grid, Tooltip } from '@mui/material';
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
  const userSubscribed = useRef(null);
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
    const response = await getSuscribeUserProduct(productId);
    userSubscribed.current = response;
    
    await getProduct(productId, (productResponse) => {
      const product = productResponse.data
      setFile({ name: productResponse.data.image });
      setProduct(product);
    }, (error) => setAlert({ type: 'error', message: error }));
  }

  const unsuscribeUserProductFunction = async (productBought = userSubscribed.current?.productBought, productSold = userSubscribed.current?.productSold, noStock = userSubscribed.current?.noStock) => {
    await suscribeUserProduct(productId, productBought, productSold, noStock);
    const response = await getSuscribeUserProduct(productId);
    userSubscribed.current = response;
    if (response)
      setAlert({ type: 'success', message: "Unsuscribe successfully" });
  }

  const suscribeUserProductFunction = async (productBought = userSubscribed.current?.productBought, productSold = userSubscribed.current?.productSold, noStock = userSubscribed.current?.noStock) => {
    await suscribeUserProduct(productId, productBought, productSold, noStock);
    const response = await getSuscribeUserProduct(productId);
    userSubscribed.current = response;
    if (response)
      setAlert({ type: 'success', message: "Suscribe successfully" });
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
            {(!userSubscribed.current || !userSubscribed.current.productBought) && 
              <Tooltip title='Subscribe to purchases and sales'>
                <IconButton aria-label="delete" size="medium" onClick={async () =>  await suscribeUserProductFunction(true, true)}>
                  <SubscriptionsIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            }
            {userSubscribed.current && userSubscribed?.current.productBought && 
              <Tooltip title='Unsubscribe to purchases and sales'>
                <IconButton aria-label="delete" size="medium" onClick={async () =>  await unsuscribeUserProductFunction(false, false)}>
                  <UnsubscribeIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            }

            {!userSubscribed.current?.noStock && 
              <Tooltip title='Subscribe to stock'>
                <IconButton aria-label="delete" size="medium" onClick={async () =>  await suscribeUserProductFunction(userSubscribed.current?.productBought, userSubscribed.current?.productSold, true)}>
                  <InventoryIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            }
            {userSubscribed.current?.noStock && 
              <Tooltip title='Unsubscribe to stock'>
                <IconButton aria-label="delete" size="medium" onClick={async () =>  await unsuscribeUserProductFunction(userSubscribed.current?.productBought, userSubscribed.current?.productSold, false)}>
                  <UnsubscribeIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
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
