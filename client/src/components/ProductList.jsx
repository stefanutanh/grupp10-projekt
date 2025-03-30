import ProductItemSmall from './ProductItemSmall';
import { getAll } from '../services/ProductService';
import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';

function ProductList({ pathname }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAll(pathname)
      .then((products) => setProducts(products || [])) // Säkerställ alltid en array
      .catch((error) => {
        console.error("Fel vid hämtning av produkter:", error);
        setProducts([]);
      });
  }, [pathname]);

  return (
    <>
      {products.length > 0 ? (
        <Grid container spacing={2}>
          {products
            .filter((p) => p && p.createdAt) // Filtrera bort null och produkter utan datum (chat)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((product) => (
              <Grid item xs={12} sm={6} md={4} key={`products_${product.id}`}>
                <ProductItemSmall product={product} />
              </Grid>
            ))}
        </Grid>
      ) : (
        <Typography variant="h5">
          {products.length === 0 ? "Inga produkter hittades" : "Kunde inte hämta produkter"}
        </Typography>
      )}
    </>
  );
}

export default ProductList;
