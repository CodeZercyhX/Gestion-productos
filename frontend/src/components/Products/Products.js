import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdding, setIsAdding] = useNavigate(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error("Error al obtener los productos", err);
      }
    };

    fetchProducts();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.error("Error al eliminar el producto", err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    console.log('intento de agregar un producto...');
    setIsAdding(true); // Cambiar el formulario para edición
    
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts([...products, response.data]);
      setIsAdding(true);
    } catch (err) {
      console.error("Error al agregar el producto", err);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${selectedProduct._id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(
        products.map((product) =>
          product._id === selectedProduct._id ? response.data : product
        )
      );
      setSelectedProduct(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Error al actualizar el producto", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>
      
      {isAdding ? (
        <ProductForm
          product={selectedProduct}
          onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
        />
      ) : (
        <>
          <button
            onClick={() => setIsAdding(false)}
            className="bg-green-500 text-white p-2 rounded mb-4"
          >
            Agregar Producto
          </button>
          <table className="min-w-full table-auto bg-white rounded shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white p-2 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Products;
