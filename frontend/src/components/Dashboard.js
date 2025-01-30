import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Para la búsqueda
  const navigate = useNavigate();

  // Obtener productos del backend
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setFilteredProducts(response.data); // Almacenar productos filtrados
    } catch (error) {
      console.error("Error al obtener productos:", error);
      alert("Error al obtener productos. Por favor, inicia sesión de nuevo.");
      logout();
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar formulario para agregar o editar productos
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingProduct) {
        // Actualizar producto
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Producto actualizado correctamente.");
      } else {
        // Agregar producto
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Producto agregado correctamente.");
      }

      setFormData({ name: "", description: "", price: "", category: "", stock: "" });
      setEditingProduct(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar producto.");
    }
  };

  // Eliminar producto
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Producto eliminado correctamente.");
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto.");
    }
  };

  // Abrir modal para agregar o editar producto
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: "", category: "", stock: "" });
    }
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Función para manejar búsqueda de productos
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setFilteredProducts(products); // Mostrar todos los productos si no hay búsqueda
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Encabezado */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <h1 className="text-3xl font-bold">Dashboard de Productos</h1>
        </div>
      </header>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Buscar por nombre"
          className="w-full md:w-1/3 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition ml-4"
        >
          Agregar Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
        <h2 className="text-2xl font-semibold mb-4">Lista de Productos</h2>
        {filteredProducts.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4 text-gray-700">Nombre</th>
                <th className="border-b p-4 text-gray-700">Descripción</th>
                <th className="border-b p-4 text-gray-700">Precio</th>
                <th className="border-b p-4 text-gray-700">Categoría</th>
                <th className="border-b p-4 text-gray-700">Cantidad</th>
                <th className="border-b p-4 text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="border-b p-4">{product.name}</td>
                  <td className="border-b p-4">{product.description}</td>
                  <td className="border-b p-4">{product.price}</td>
                  <td className="border-b p-4">{product.category}</td>
                  <td className="border-b p-4">{product.stock}</td>
                  <td className="border-b p-4 flex gap-4">
                    <button
                      onClick={() => openModal(product)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay productos disponibles.</p>
        )}
      </div>

      {/* Modal para agregar o editar productos */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingProduct ? "Editar Producto" : "Agregar Producto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Precio"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Categoría"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Cantidad en inventario"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  {editingProduct ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 mt-6 fixed bottom-0 w-full">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>&copy; 2025 Todos los derechos reservados</p>
          <p>Hecho con ❤️ por Luis ZercyhX Hurtado</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
