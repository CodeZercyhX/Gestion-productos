import React, { useState, useEffect } from "react";

const ProductForm = ({ product, onSubmit }) => {
  const [name, setName] = useState(product ? product.name : "");
  const [description, setDescription] = useState(product ? product.description : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [category, setCategory] = useState(product ? product.category : "" )
  const [stock, setStock] = useState(product ? product.stock : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { name, description, price, category, stock };
    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      
      <input
        type="text"
        placeholder="categoría en inventario"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Cantidad en inventario"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {product ? "Actualizar Producto" : "Agregar Producto"}
      </button>
    </form>
  );
};

export default ProductForm;
