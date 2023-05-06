import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getPurchases } from '../../services/purchaseService';
import {
    Grid, Card, CardContent, CardActions, Typography, Paper,
} from '@mui/material';

import styled from 'styled-components';
import Button from '@mui/material/Button';
import { isATokenValid } from '../../services/userService';
import { removeLocalStorage } from '../../utils';

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

function PurchasesList(props) {
  const navigate = useNavigate();
  const [purchasesList, setPurchasesList] = useState([]);
  const [errorToShow, setErrorToShow] = useState(null);

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
    const purchases = await getPurchases();
    setPurchasesList(purchases.data);
  }

  return (
    <Paper sx={{ m: 3, p: 2 }} >
      <Typography variant="h4" component="h1">
        Purchases
        <StyledButton
          variant="contained"
          sx={{
            my: 2, ml: 1, width: 180, height: 40,
          }}
          onClick={() => navigate('/createPurchase')}
        >
          Create Purchase
        </StyledButton>
      </Typography>

      { purchasesList.length ? (
        <Grid container spacing={2}>
            {purchasesList.map((purchase) => {
              const {
                id
              } = purchase;

              if (!id ) {
                return null;
              }

              return (
                <Grid item sx={{ width: '100%'}}  key={purchase.id}>
                    <StyledCard className="custom-card">
                      <CardContent>
                        <Grid>
                          <Typography gutterBottom variant="h5" component="div">
                            {purchase.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Provider: {purchase.providerId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                              Date: {purchase.date}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Cost: {purchase.totalcost}
                            </Typography>

                        </Grid>
                      </CardContent>
                    </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1">There are no purchases yet!</Typography>
        )
      }

      <Typography variant="h6" component="h1" sx={{ color: 'red', py: 2 }}>{errorToShow}</Typography>
    </Paper>
  );
}

PurchasesList.propTypes = {
  list: PropTypes.array,
};

PurchasesList.defaultProps = {
  list: [],
};

export default PurchasesList;
