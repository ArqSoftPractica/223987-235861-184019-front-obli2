import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteProduct, getProducts } from '../../services/productService';
import {
    Grid, Card, CardContent, CardActions, Typography, IconButton, Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import { getUser, removeLocalStorage } from '../../utils';
import { isATokenValid } from '../../services/userService';

const StyledCard = styled(Card)`
&&.custom-card {
  border: 1px solid #f0e4ff;
  box-shadow: 0px 3px 2px rgba(77, 71, 71, 0.349);
  display: flex;
  flex-direction: row;
}
`;

const StyledCardActions = styled(CardActions)`
  display: flex;
  margin-left: auto;
`;

const StyledButton = styled(Button)`
  position: absolute;
  left: 70%;
`;

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function ProductsList(props) {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [errorToShow, setErrorToShow] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
    const user = getUser();
    setIsAdmin(user?.role === "ADMIN");
    const products = await getProducts();
    setProductsList(products.data);

  }

  let showError =  (error) => setErrorToShow(error)
  let doOnDeleteSuccess = async () => {
      setErrorToShow(null);
      await fetchData();
  }

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h4" component="h1">
        Products
        <StyledButton
          variant="contained"
          sx={{
            my: 2, ml: 1, width: 175, height: 40,
          }}
          onClick={() => navigate('/createProduct')}
        >
          Create Product
        </StyledButton>
      </Typography>

      { productsList.length ? (
        <Grid container spacing={2}>
            {productsList.map((product) => {
              const {
                id, name
              } = product;

              if (!id || !name ) {
                return null;
              }

              return (           
                <Grid item sx={{ width: '100%'}}  key={product.id}>
                    <StyledCard className="custom-card">
                      <CardMedia
                        style={{ maxWidth: "15%"}}
                        component="img"
                        image={`https://s3-asp-jodus-ellis-reyes.s3.amazonaws.com/${product.image}`}
                        alt="Image"
                      />
                        <CardContent>
                      <Grid>
                            <Typography gutterBottom variant="h5" component="div">
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Id: {product.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Stock: {product.stock}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Price: {product.price}
                            </Typography>
                            { product.description?  <Typography variant="body2" color="text.secondary">
                              Description: {product.description}
                            </Typography> : null }
                            </Grid>
                        </CardContent>
                        {isAdmin && 
                        <StyledCardActions>
                          <IconButton
                              aria-label="edit"
                              size="medium"
                              onClick={() => navigate(`/editProduct/${product.id}`)}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton aria-label="delete" size="medium" onClick={() => deleteProduct(product.id, doOnDeleteSuccess, showError)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </StyledCardActions>}
                    </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1">There are no products yet!</Typography>
        )
      }

      <Typography variant="h6" component="h1" sx={{ color: 'red', py: 2 }}>{errorToShow}</Typography>
    </Paper>
  );
}

ProductsList.propTypes = {
  list: PropTypes.array,
};

ProductsList.defaultProps = {
  list: [],
};

export default ProductsList;
