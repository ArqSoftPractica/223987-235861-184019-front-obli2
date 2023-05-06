import React, { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { getUser, isUserLogged } from '../utils';

function Root() {
  const [userLogged, setUserLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  window.addEventListener('storage', () => {
    setUserLogged(isUserLogged());
    const user = getUser();
    setIsAdmin(user?.role === "ADMIN")
  })

  useEffect(() => {
    setUserLogged(isUserLogged());
    const user = getUser();
    setIsAdmin(user?.role === "ADMIN")
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserLogged(false);
    setIsAdmin(false);
    navigate('/signIn');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div style={{ height: '8vh' }}>
        <AppBar position="relative" sx={{ height: '100%', justifyContent: 'center' }}>
            {userLogged && (
               <Toolbar>
                <MenuItem
              sx={{
                textDecoration: 'none',
                letterSpacing: 1,
              }}
              component={RouterLink}
              to="/home"
            >
              Home
            </MenuItem>
            { isAdmin && <>
              <MenuItem
              sx={{
                textDecoration: 'none',
                letterSpacing: 1,
              }}
              component={RouterLink}
              to="/products"
            >
              Products
            </MenuItem>
            <MenuItem
              sx={{
                textDecoration: 'none',
                letterSpacing: 1,
              }}
              component={RouterLink}
              to="/providers"
            >
              Providers
            </MenuItem>
            <MenuItem
              sx={{
                textDecoration: 'none',
                letterSpacing: 1,
              }}
              component={RouterLink}
              to="/purchases"
            >
              Purchases
            </MenuItem>
            <MenuItem
              sx={{
                textDecoration: 'none',
                letterSpacing: 1,
              }}
              component={RouterLink}
              to="/sendRegisterLink"
            >
              Invite User
            </MenuItem>
            </>          
              }
              <div style={{ display: "flex", 'marginLeft': "auto", }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </div>
              </Toolbar>
            )}
        </AppBar>
      </div>
      <div style={{ height: '92vh' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
