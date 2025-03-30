import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button, 
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getAll, getCart, removeFromCart, updateCartItem, clearCart } from '../services/CartService';

function CartView() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Default user ID 
  const userId = 1;

  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getCart(userId);
      console.log("Cart items:", items);
      
      if (items && Array.isArray(items)) {
        setCartItems(items);
        calculateTotal(items);
      } else {
        console.warn("Unexpected cart data format:", items);
        setCartItems([]);
        setTotalPrice(0);
      }
      setError(null);
    } catch (err) {
      console.error("Fel vid hämtning av varukorg:", err);
      setError("Kunde inte hämta varukorgen. Försök igen senare.");
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Beräkna totalt pris
  const calculateTotal = (items) => {
    if (items && Array.isArray(items) && items.length > 0) {
      const sum = items.reduce((total, item) => {
        // Kontrollera att item och product finns
        if (item && item.product && item.product.price) {
          return total + (item.product.price * item.amount);
        }
        return total;
      }, 0);
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  };

  // Hantera uppdatering av antal
  const handleUpdateAmount = async (cartRowId, currentAmount, change) => {
    const newAmount = currentAmount + change;
    
    if (newAmount <= 0) {
      // Om mängden blir 0 eller mindre, ta bort produkten
      handleRemoveItem(cartRowId);
    } else {
      try {
        const result = await updateCartItem(cartRowId, newAmount);
        if (result) {
          loadCart();
          showSnackbar('Antalet har uppdaterats', 'success');
        } else {
          showSnackbar('Kunde inte uppdatera antalet', 'error');
        }
      } catch (err) {
        console.error("Fel vid uppdatering av antal:", err);
        showSnackbar('Ett fel uppstod vid uppdatering av antalet', 'error');
      }
    }
  };

  // Hantera borttagning av en produkt
  const handleRemoveItem = async (cartRowId) => {
    try {
      const result = await removeFromCart(cartRowId);
      if (result) {
        loadCart();
        showSnackbar('Produkten har tagits bort från varukorgen', 'success');
      } else {
        showSnackbar('Kunde inte ta bort produkten', 'error');
      }
    } catch (err) {
      console.error("Fel vid borttagning av produkt:", err);
      showSnackbar('Ett fel uppstod vid borttagning av produkten', 'error');
    }
  };

  // Hantera tömning av varukorgen
  const handleClearCart = async () => {
    if (cartItems.length > 0) {
      try {
        // Säkerställ att vi har cartId
        const cartId = cartItems[0].cartId;
        if (!cartId) {
          showSnackbar('Kunde inte hitta varukorgs-ID', 'error');
          return;
        }
        
        const result = await clearCart(cartId);
        if (result) {
          setCartItems([]);
          setTotalPrice(0);
          showSnackbar('Varukorgen har tömts', 'success');
        } else {
          showSnackbar('Kunde inte tömma varukorgen', 'error');
        }
      } catch (err) {
        console.error("Fel vid tömning av varukorg:", err);
        showSnackbar('Ett fel uppstod vid tömning av varukorgen', 'error');
      }
    }
  };

  // Visar ett snackbar-meddelande
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Stänger snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // loading indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Visa felmeddelande
  if (error) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
        <Typography>{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 1 }}
          onClick={loadCart}
        >
          Försök igen
        </Button>
      </Paper>
    );
  }

  // Om inga produkter i varukorgen
  if (!cartItems || cartItems.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" gutterBottom>Din varukorg är tom</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Badge badgeContent={cartItems.length} color="primary" sx={{ mr: 1 }}>
          <ShoppingCartIcon />
        </Badge>
        Din varukorg
      </Typography>
      
      <List>
        {Array.isArray(cartItems) && cartItems.map((item) => (
          <Box key={`cart_item_${item.id}`}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" noWrap>
                    {item.product?.title || 'Okänd produkt'}
                  </Typography>
                }
                secondary={`${item.product?.price || 0} kr/st`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <IconButton size="small" onClick={() => handleUpdateAmount(item.id, item.amount, -1)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.amount || 0}</Typography>
                <IconButton size="small" onClick={() => handleUpdateAmount(item.id, item.amount, 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body1" sx={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                {((item.amount || 0) * (item.product?.price || 0)).toFixed(2)} kr
              </Typography>
            </ListItem>
            <Divider />
          </Box>
        ))}
        <ListItem sx={{ mt: 2 }}>
          <ListItemText primary={<Typography variant="h6">Totalt:</Typography>} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {totalPrice.toFixed(2)} kr
          </Typography>
        </ListItem>
      </List>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleClearCart}
          startIcon={<DeleteIcon />}
        >
          Töm varukorg
        </Button>
        <Button 
          variant="contained" 
          color="primary"
        >
          Till kassan
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CartView;