import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  quantities: { quantity: string; stock: number }[];
}

function UpdateStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('');
  const [newStock, setNewStock] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hardware/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProductObj = products.find((p) => p._id === selectedProduct);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedQuantity || newStock < 0) {
      alert('Please fill all fields correctly');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/hardware/products/stock`,
        {
          productId: selectedProduct,
          quantity: selectedQuantity,
          newStock,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Stock updated successfully!');
      setSelectedProduct('');
      setSelectedQuantity('');
      setNewStock(0);
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating stock');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Update Stock</h1>
        <p className="mt-2 text-gray-600">Update stock levels for existing products</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedQuantity('');
                setNewStock(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProductObj && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Quantity
              </label>
              <select
                value={selectedQuantity}
                onChange={(e) => {
                  setSelectedQuantity(e.target.value);
                  const qtyObj = selectedProductObj.quantities.find(
                    (q) => q.quantity === e.target.value
                  );
                  if (qtyObj) {
                    setNewStock(qtyObj.stock);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Quantity</option>
                {selectedProductObj.quantities.map((qty, index) => (
                  <option key={index} value={qty.quantity}>
                    {qty.quantity} (Current Stock: {qty.stock})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedQuantity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Stock Value
              </label>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedProduct || !selectedQuantity}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating Stock...' : 'Update Stock'}
          </button>
        </div>
      </form>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-1">
                  {product.quantities.map((qty, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{qty.quantity}:</span>
                      <span
                        className={`font-semibold ${
                          qty.stock < 10 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {qty.stock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateStock;

