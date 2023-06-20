import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root from './views/root';
import ErrorPage from './views/errorPage';
import SignIn from './views/signIn';
import SignUp from './views/signUp';
import SendRegisterLink from './views/registerlink/sendRegisterLinkEmail'
import ProductsList from './views/products/productsList';
import RedirectLoggedInUser from './components/RedirectLoggedInUser';
import RedirectLoggedUser from './components/RedirectLoggedUser';
import CreateProduct from './views/products/createProduct';
import EditProduct, { productLoader } from './views/products/editProduct';
import RegisterViaLink from './views/registerlink/registerViaLink';
import SalesView from './views/sales/salesView';
import ProvidersList from './views/providers/providersList';
import CreateProvider from './views/providers/createProvider';
import EditProvider, { providerLoader } from './views/providers/editProvider';
import RequiereAdminUser from './components/RequiereAdminUser';
import PurchasesList from './views/purchases/purchasesList';
import CreatePurchase from './views/purchases/createPurchase';
import CreateSale from './views/sales/createSale';
import ViewProduct from './views/products/viewProduct';

const router = createHashRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <RedirectLoggedUser/>
        ),
      },
      {
        path: '/home',
        element: (
          <RedirectLoggedInUser>
            <SalesView/>
          </RedirectLoggedInUser>
        ),
      },
      {
        path: '/signIn',
        element: (
            <SignIn/>
        ),
      },
      {
        path: '/sendRegisterLink',
        element: (
          <RequiereAdminUser>
            <SendRegisterLink/>
          </RequiereAdminUser>
        ),
      },
      {
        path: '/register',
        element: (
          <RegisterViaLink/>
        ),
      },
      {
        path: '/signUp',
        element: (
          <SignUp/>
        ),
      },
      {
        path: '/products',
        element: (
          <RequiereAdminUser>
            <ProductsList/>
          </RequiereAdminUser>
        ),
      },
      {
        path: '/createProduct',
        element: (
          <RequiereAdminUser>
           <CreateProduct/>
          </RequiereAdminUser>
        ),
      },
      {
        path: '/editProduct/:productId',
        element: (
          <RequiereAdminUser>
            <EditProduct/>
          </RequiereAdminUser>
        ),
        loader: productLoader,
      },
      {
        path: '/viewProduct/:productId',
        element: (
          <RequiereAdminUser>
            <ViewProduct/>
          </RequiereAdminUser>
        ),
        loader: productLoader,
      },
      {
        path: '/providers',
        element: (
          <RequiereAdminUser>
            <ProvidersList/>
          </RequiereAdminUser>
        ),
      },
      {
        path: '/createProvider',
        element: (
          <RequiereAdminUser>
            <CreateProvider/>
          </RequiereAdminUser>
        ),
      },
      {
        path: '/editProvider/:providerId',
        element: (
          <RequiereAdminUser>
            <EditProvider/>
          </RequiereAdminUser>
        ),
        loader: providerLoader,
      },
      {
        path: '/purchases',
        element: (
          <RequiereAdminUser>
            <PurchasesList/>
          </RequiereAdminUser>
        ),
      },
      {
        path: '/createPurchase',
        element: (
          <RequiereAdminUser>
            <CreatePurchase/>
          </RequiereAdminUser>
        ),
      },
      {
        path:'/createSale',
        element: (
          <RedirectLoggedInUser>
            <CreateSale/>
          </RedirectLoggedInUser>
        ),
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);