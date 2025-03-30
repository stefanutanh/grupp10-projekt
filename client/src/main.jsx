import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ProductEdit from './views/ProductEdit.jsx';
import Products from './views/Product.jsx';
import ProductDetail from './views/ProductDetail.jsx';
import Home from './views/Home.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  blueGrey,
  deepPurple,
  green,
  grey,
  orange,
  purple,
  red,
  teal
} from '@mui/material/colors';



const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f3f3f3',
      paper: grey[50]
    },
    primary: {
      main: green[700]
    },
    secondary: {
      main: green[600]
    },
    success: {
      main: teal['700']
    },
    error: {
      main: red['700']
    }
  },
  typography: {
    fontFamily: '"Ubuntu", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'Lilita One',
      fontSize: '3.7rem'
    },
    h2: {
      fontFamily: 'Lilita One',
      fontSize: '2.1rem',
      marginBottom: '.7em',
      color: blueGrey[800]
    },
    h3: {
      fontSize: '1.6rem'
    },
    h4: {
      fontSize: '1.3rem',
      color: 'rgb(106, 77, 123)'
    },
    body1: { color: blueGrey[700],
      fontFamily: 'Lilita One'
     },
    body2: { color: blueGrey[1] }
  }
});


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/products/:id/edit',
        element: <ProductEdit />
      },
      {
        path: '/products/:id',
        element: <ProductDetail />
      },
      {
        path: '/products/new',
        element: <ProductEdit />
      },
      {
        path: '/users/:id/Products',
        element: <Products />
      },
      
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);