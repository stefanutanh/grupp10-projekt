import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Badge,
  Popover
} from '@mui/material';
import { useState, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CartView from './components/CartView';
import { getAll } from './services/CartService';

function App() {
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  
  useEffect(() => {
    loadCartCount();
    
    
    const intervalId = setInterval(loadCartCount, 60000); 
    
    return () => clearInterval(intervalId); 
  }, []);

  const loadCartCount = async () => {
    try {
      const items = await getAll();
      if (items && Array.isArray(items)) {
        setCartItemCount(items.length);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
    loadCartCount(); 
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const openCartPage = () => {
    handleCartClose();
    navigate('/checkout');
  };

  const cartOpen = Boolean(cartAnchorEl);
  const cartId = cartOpen ? 'cart-popover' : undefined;

  const navItems = [
    { text: 'Hem', icon: <HomeIcon />, path: '/' },
    { text: 'Skapa produkt', icon: <AddCircleIcon />, path: '/products/new' },
  ];

  return (
    <>
      <Box component="header" sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          elevation={3}
          sx={{
            background: (theme) => `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography 
              variant="h1" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: '3rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                RANDOM AB
              </Link>
            </Typography>

            {/* Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button 
                  key={item.text} 
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ 
                    mx: 1, 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    },
                    borderRadius: '8px',
                    padding: '8px 16px',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

          </Toolbar>
        </AppBar>
      </Box>
      
      {/* Cart Popover */}
      <Popover
        id={cartId}
        open={cartOpen}
        anchorEl={cartAnchorEl}
        onClose={handleCartClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ width: 400, maxWidth: '100vw', p: 2 }}>
          <CartView />
        </Box>
      </Popover>
      
      <Container 
        sx={{ 
          mt: 4, 
          mb: 8,
          minHeight: 'calc(100vh - 200px)' 
        }} 
        maxWidth="xl" 
        component="main"
      >
        <Outlet />
      </Container>

      {/* Basic Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: 'primary.dark', 
          color: 'white',
          textAlign: 'center',
          mt: 'auto'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2">
            © {new Date().getFullYear()} Random Webbshop - Tillverkad av 97 % återanvända pixlar
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default App;