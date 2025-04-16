import React from 'react';

const ProductForm = ({ form, setForm, handleAdd, handleUpdate }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        placeholder="ID"
        value={form.Id}
        onChange={e => setForm({ ...form, Id: e.target.value })}
        required
      />
      <input
        placeholder="Name"
        value={form.Name}
        onChange={e => setForm({ ...form, Name: e.target.value })}
        required
      />
      <input
        placeholder="Description"
        value={form.Description}
        onChange={e => setForm({ ...form, Description: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={form.Price}
        onChange={e => setForm({ ...form, Price: e.target.value })}
        required
      />
      <input
        placeholder="Category"
        value={form.Category}
        onChange={e => setForm({ ...form, Category: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={form.Stock}
        onChange={e => setForm({ ...form, Stock: e.target.value })}
        required
      />
      <input
        placeholder="Image URL"
        value={form.ImageUrl}
        onChange={e => setForm({ ...form, ImageUrl: e.target.value })}
      />
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleAdd}>Add Product</button>
        {form.Id && <button onClick={handleUpdate}>Update Product</button>}
      </div>
    </form>
  );
};

export default ProductForm;
