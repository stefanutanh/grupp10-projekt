import {
	Box,
	Button,
	CardMedia,
	Container,
	Divider,
	Typography,
} from '@mui/material';
import { getCart, reduceAmount, increaseAmount } from '../services/CartService';
import { useEffect, useState } from 'react';
import placeholderImage from '../assets/placeholder.png';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

function Carts() {
	const navigate = useNavigate();
	const userId = 1;

	const [cart, setCart] = useState(null);
	useEffect(() => {
		getCart(userId).then((cart) => setCart(cart));
	}, [userId]);

	const handleReduceAmount = async (userId, productId) => {
		await reduceAmount(userId, productId);
		const updatedCart = await getCart(userId);
		setCart(updatedCart);
	};

	const handleIncreaseAmount = async (userId, productId) => {
		await increaseAmount(userId, productId);
		const updatedCart = await getCart(userId);
		setCart(updatedCart);
	};

	return (
		<>
			<Container>
				<Typography variant='h3' sx={{ mt: 4, mb: 2 }}>
					Varukorg
				</Typography>
				<Divider sx={{ mt: 2, mb: 4, borderColor: 'primary.main' }} />
			</Container>
			{cart ? (
				<div>
					{cart.map((cartRows) => (
						<Container key={cartRows.id}>
							<Box sx={{ mb: 4 }}>
								<Link to={`/products/${cartRows.product.id}`}>
									<CardMedia
										component='img'
										image={cartRows.product.imageUrl || placeholderImage}
										alt={cartRows.product.title}
										sx={{ maxWidth: '10%', mb: 2 }}
									/>
									<Typography>Produkt: {cartRows.product.title}</Typography>
								</Link>
								<Typography>Pris: {cartRows.product.price} kr</Typography>
								<Typography>Antal: {cartRows.amount}</Typography>
								<Typography>
									Totalt: {cartRows.product.price * cartRows.amount} kr
								</Typography>
								<Button
									startIcon={<RemoveIcon />}
									variant='contained'
									onClick={() =>
										handleReduceAmount(userId, cartRows.product.id)
									}
								/>
								<Button
									sx={{ ml: 2 }}
									startIcon={<AddIcon />}
									variant='contained'
									onClick={() =>
										handleIncreaseAmount(userId, cartRows.product.id)
									}
								/>
							</Box>
						</Container>
					))}

					<Container>
						<Box>
							<Divider sx={{ mt: 3, mb: 2, borderColor: 'primary.main' }} />
							<Typography variant='h4' component='h2' sx={{ m: 5 }}>
								Totalt:{' '}
								{cart
									.reduce((acc, row) => acc + row.product.price * row.amount, 0)
									.toFixed(2)}{' '}
								kr
							</Typography>
						</Box>
						<Box display={'flex'} justifyContent={'space-between'}>
							<Button
								variant='contained'
								color='secondary'
								startIcon={<ChevronLeftIcon />}
								onClick={() => navigate(-1)}
							>
								Tillbaka
							</Button>
							<Button
								variant='contained'
								color='success'
								startIcon={<ShoppingCartCheckoutIcon />}
							>
								Slutför köp
							</Button>
						</Box>
					</Container>
				</div>
			) : (
				<Typography variant='h6'>Kunde inte hämta varukorg</Typography>
			)}
		</>
	);
}

export default Carts;