import ProductItemLarge from '../components/ProductItemLarge';
import axios from '../services/api';
import { Alert, Box, Button, Container, Paper, Typography, Snackbar, Divider } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOne } from '../services/ProductService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EditIcon from '@mui/icons-material/Edit';
import Rating from '@mui/material/Rating';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { addToCart } from '../services/CartService';

// Komponent för betyg och betygsättning
function ProductRating({ productId, onRatingSuccess }) {
  const [value, setValue] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratings, setRatings] = useState([]); // Ny state-variabel för att lagra alla betyg (chatgpt)
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Läs in tidigare betyg
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`/products/${productId}/ratings`);
        if (response.data) {
          setAverageRating(response.data.averageRating || 0);
          setRatingCount(response.data.count || 0);
          setRatings(response.data.ratings || []); // Uppdatera betygslistan
        }
      } catch (err) {
        console.error("Fel vid hämtning av betyg:", err);
        setError("Kunde inte hämta produktbetyg");
      }
    };

    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  // Skicka betygsättning
  const handleRatingChange = async (event, newValue) => {
    setValue(newValue);
    if (newValue > 0) {
      setSubmitting(true);
      try {
        const response = await axios.post(`/products/${productId}/addRating`, {
          rating: newValue,
          userId: 1 // Hårdkodad användare för enkelhetens skull
        });
        
        if (response.data && response.data.data) {
          // Uppdatera genomsnittsbetyg och räknare
          setAverageRating(response.data.data.averageRating || 0);
          setRatingCount(response.data.data.count || 0);
          setRatings(prevRatings => [...prevRatings, { rating: newValue }]); // Uppdatera betygslistan (chatgpt)
          setError(null);
          if (onRatingSuccess) {
            onRatingSuccess("Tack för ditt betyg!");
          }
        }
      } catch (err) {
        console.error("Fel vid betygsättning:", err);
        setError("Kunde inte spara ditt betyg");
        if (onRatingSuccess) {
          onRatingSuccess("Ett fel uppstod vid betygsättning", "error");
        }
      } finally {
        setSubmitting(false);
      }
    }
  };



  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Betygsätt produkten</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={handleRatingChange}
          disabled={submitting}
          size="large"
        />
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Klicka för att betygsätta
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body1" gutterBottom>
        Genomsnittligt betyg: <strong>{averageRating.toFixed(1)}</strong> / 5
        {ratingCount > 0 && ` (${ratingCount} betyg)`}
      </Typography>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
  
      <Divider sx={{ my: 2 }} />
  
      <Typography variant="h6" gutterBottom>Alla betyg</Typography>

      <ul>
       {ratings.map((rating, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Rating value={rating.rating} readOnly size="small" />
      </Box>
    ))}
      </ul>
      
    </Paper>
  );
}


function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const [open, setOpen] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(1, product.id, 1);
      
      if (result) {
        setSnackbarMessage(`${product.title} tillagd i varukorgen`);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Kunde inte lägga till produkten i varukorgen');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbarMessage('Ett fel inträffade');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleRatingSuccess = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    setLoading(true);
    getOne(id)
      .then((product) => {
        setProduct(product);
        setError(null);
      })
      .catch((error) => {
        console.error("ProductDetail: fel vid hämtning av produkt:", error);
        setError("Kunde inte hämta produkten");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  //Lägger till innehållet på sidan
  useEffect(() => {
    if (location.state) {
      setProduct(location.state);
    }
  }, [location.state]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h5">Laddar produkt...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h5" color="error">{error}</Typography>
        <Button
          variant="contained"
          startIcon={<ChevronLeftIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Tillbaka till startsidan
        </Button>
      </Container>
    );
  }

  return product ? (
    <>
      {message && open && (
        <Alert
          onClose={() => {
            setOpen(false);
          }}
          variant="filled"
          severity="success"
        >
          {message}
        </Alert>
      )}
      <Container maxWidth="lg">
        <ProductItemLarge product={product} />
        
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Button
            variant="contained"
            startIcon={<ChevronLeftIcon />}
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            Tillbaka
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={handleAddToCart}
            endIcon={<ShoppingCartIcon />}
          >
            Lägg i varukorgen
          </Button>

          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            Redigera produkt
          </Button>
        </Box>

        <ProductRating productId={id} onRatingSuccess={handleRatingSuccess} />
        
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  ) : (
    <Container maxWidth="lg">
      <Typography variant="h5">Ingen produkt hittades</Typography>
      <Button
        variant="contained"
        startIcon={<ChevronLeftIcon />}
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Tillbaka till startsidan
      </Button>
    </Container>
  );
}


export default ProductDetail;