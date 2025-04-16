import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, TextField, Button,
  Card, CardContent, CardMedia, IconButton, Modal
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from './service/ProductService';
import './App.css';

const initialFormState = {
  Id: '',
  Name: '',
  Price: '',
  Description: '',
  Category: '',
  Stock: '',
  ImageUrl: ''
};

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [view, setView] = useState('products');
  const [openModal, setOpenModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = () => {
    getAllProducts()
      .then(res => {
        const normalized = res.data.map(p => ({
          Id: p.Id || p.id || '',
          Name: p.Name || p.name || '',
          Description: p.Description || p.description || '',
          Price: p.Price || p.price || 0,
          Category: p.Category || p.category || '',
          Stock: p.Stock || p.stock || 0,
          ImageUrl: p.ImageUrl || p.imageUrl || '',
        }));
        setProducts(normalized);
      })
      .catch(() => setError('Failed to fetch products'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    const product = {
      ...form,
      Price: parseFloat(form.Price),
      Stock: parseInt(form.Stock)
    };

    createProduct(product)
      .then(() => {
        setForm(initialFormState);
        fetchProducts();
      })
      .catch(() => setError('Failed to create product'));
  };

  const handleUpdate = () => {
    const product = {
      ...form,
      Price: parseFloat(form.Price),
      Stock: parseInt(form.Stock)
    };

    updateProduct(form.Id, product)
      .then(() => {
        setForm(initialFormState);
        fetchProducts();
      })
      .catch(() => setError('Failed to update product'));
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete)
        .then(() => {
          fetchProducts();
          setOpenModal(false);
        })
        .catch(() => setError('Failed to delete product'));
    }
  };

  const handleEdit = (product) => {
    setForm({ ...product });
  };

  const SidebarIcon = ({ icon, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        m: 1,
        color: 'white',
        fontSize: 24,
        cursor: 'pointer',
        borderRadius: '50%',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#393e46',
        '&:hover': { backgroundColor: 'rgb(234, 124, 105)' }
      }}
    >
      {icon}
    </Box>
  );

  const groupByCategory = () => {
    const categories = ['pork', 'beef', 'drinks', 'noodles'];
    const grouped = {};

    categories.forEach(cat => {
      grouped[cat] = products.filter(p => (p.Category || '').toLowerCase() === cat);
    });

    grouped['others'] = products.filter(
      p => !categories.includes((p.Category || '').toLowerCase())
    );

    return grouped;
  };

  const groupedProducts = groupByCategory();

  return (
    <Box className="app-root" sx={{ display: 'flex' }}>
      <Box className="sidebar" sx={{ width: '60px', bgcolor: '#11111c', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box className="logo" sx={{ padding: '16px', textAlign: 'center' }}>🍹</Box>
        <Box className="sidebar-nav" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SidebarIcon icon={<HomeIcon />} onClick={() => setView('products')} />
          <SidebarIcon icon={<InventoryIcon />} onClick={() => setView('manage')} />
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {view === 'products' && (
          <Box className="products-panel" sx={{ bgcolor: '#1e1e2f', color: 'white', p: 2, overflowY: 'auto', flex: 1 }}>
            <Typography variant="h5" gutterBottom>Products</Typography>

            {Object.entries(groupedProducts).map(([category, items]) => (
              items.length > 0 && (
                <Box key={category} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>{category}</Typography>
                  <Grid container spacing={2}>
                    {items.map((product) => (
                      <Grid item xs={12} sm={6} md={4} key={product.Id}>
                        <Card sx={{ bgcolor: '#2c2c3e', color: 'white', width: 250, height: 400 }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={product.ImageUrl}
                            alt={product.Name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Typography variant="h6">{product.Name}</Typography>
                            <Typography variant="body2">{product.Description}</Typography>
                            <Typography variant="subtitle2">₱{product.Price}</Typography>
                            <Typography variant="caption">Stock: {product.Stock}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton color="primary" onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                              <IconButton color="error" onClick={() => { setProductToDelete(product.Id); setOpenModal(true); }}><DeleteIcon /></IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )
            ))}
          </Box>
        )}

        {view === 'manage' && (
          <Box className="manage-panel" sx={{ flex: 1, bgcolor: '#11111c', p: 2, color: 'white', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 600, backgroundColor: '#2c2c3e', borderRadius: '8px', p: 3 }}>
              <Typography variant="h6" gutterBottom>Manage Product</Typography>
              <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="ID" value={form.Id} onChange={e => setForm({ ...form, Id: e.target.value })} fullWidth />
                <TextField label="Name" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} fullWidth />
                <TextField label="Description" value={form.Description} onChange={e => setForm({ ...form, Description: e.target.value })} fullWidth />
                <TextField label="Price" type="number" value={form.Price} onChange={e => setForm({ ...form, Price: e.target.value })} fullWidth />
                <TextField label="Category" value={form.Category} onChange={e => setForm({ ...form, Category: e.target.value })} fullWidth />
                <TextField label="Stock" type="number" value={form.Stock} onChange={e => setForm({ ...form, Stock: e.target.value })} fullWidth />
                <TextField label="Image URL" value={form.ImageUrl} onChange={e => setForm({ ...form, ImageUrl: e.target.value })} fullWidth />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" onClick={handleAdd}>Add</Button>
                  {form.Id && <Button variant="contained" color="secondary" onClick={handleUpdate}>Update</Button>}
                </Box>
              </Box>
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
          </Box>
        )}
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={{ width: 400, p: 4, bgcolor: 'white', borderRadius: '8px', margin: 'auto', marginTop: '20%' }}>
          <Typography variant="h6" id="delete-modal-title">Are you sure you want to delete this product?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 2 }}>
            <Button variant="contained" color="error" onClick={handleDelete}>Yes, Delete</Button>
            <Button variant="contained" onClick={() => setOpenModal(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
