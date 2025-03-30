import { useLocation } from 'react-router-dom';
import ProductList from '../components/ProductList';
import CartView from '../components/CartView';
import { 
  Alert, 
  Grid, 
  Paper, 
  Typography,
  Container,
  Card,
  CardContent
} from '@mui/material';
import { useState } from 'react';

function Home() {
  const location = useLocation();
  const message = location.state?.message;
  const [open, setOpen] = useState(true);

  function clearMessage() {
    window.history.replaceState({}, '');
  }
  
  return (
    <Container maxWidth="xl">
      {message && open && (
        <Alert
          onClose={() => {
            setOpen(false);
            clearMessage();
          }}
          variant="filled"
          severity="success"
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Visar produkterna */}
        <Grid component="section" item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: (theme) => `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                mb: 1,
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              Här har vi random produkter!
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'white',
                mb: 2,
                opacity: 0.9
              }}
            >
              Utforska vårt sortiment med högkvalitativa produkter till random priser!
            </Typography>
          </Paper>
          
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <CardContent>
              <ProductList />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Varukorgen */}
        <Grid component="section" item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: (theme) => `linear-gradient(to right, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                mb: 0,
                fontSize: '1.8rem',
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              Din varukorg
            </Typography>
          </Paper>
          
          <Card sx={{ mb: 4, borderRadius: 2, overflow: 'visible' }}>
            <CardContent>
              <CartView />
            </CardContent>
          </Card>
          
        
          
          
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;