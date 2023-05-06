import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteProvider, getProviders } from '../../services/providerService';
import {
    Grid, Card, CardContent, CardActions, Typography, IconButton, Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { getUser, removeLocalStorage } from '../../utils';
import styled from 'styled-components';
import Button from '@mui/material/Button';
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

function ProvidersList(props) {
  const navigate = useNavigate();
  const [providersList, setProvidersList] = useState([]);
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
    const providers = await getProviders();
    setProvidersList(providers.data);
  }

  let showError =  (error) => setErrorToShow(error)
  let doOnDeleteSuccess = () => {
      setErrorToShow(null)
      fetchData()
      setProvidersList([]);
  }

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h4" component="h1">
        Providers
        <StyledButton
          variant="contained"
          sx={{
            my: 2, ml: 1, width: 175, height: 40,
          }}
          onClick={() => navigate('/createProvider')}
        >
          Create Provider
        </StyledButton>
      </Typography>

      { providersList.length ? (
        <Grid container spacing={2}>
            {providersList.map((provider) => {
              const {
                id, name
              } = provider;

              if (!id || !name ) {
                return null;
              }

              return (
                <Grid item sx={{ width: '100%'}}  key={provider.id}>
                    <StyledCard className="custom-card">
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {provider.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Id: {provider.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Address: {provider.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Email: {provider.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Phone: {provider.phone}
                            </Typography>
                        </CardContent>
                        {isAdmin && 
                        <StyledCardActions>
                          <IconButton
                              aria-label="edit"
                              size="medium"
                              onClick={() => navigate(`/editProvider/${provider.id}`)}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton aria-label="delete" size="medium" onClick={() => deleteProvider(provider.id, doOnDeleteSuccess(), showError)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </StyledCardActions>}
                    </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1">There are no providers yet!</Typography>
        )
      }

      <Typography variant="h6" component="h1" sx={{ color: 'red', py: 2 }}>{errorToShow}</Typography>
    </Paper>
  );
}

ProvidersList.propTypes = {
  list: PropTypes.array,
};

ProvidersList.defaultProps = {
  list: [],
};

export default ProvidersList;
