import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Quantity {
  quantity: string;
  stock: number;
}

function ManageStock() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState<string>('');
  const [quantities, setQuantities] = useState<Quantity[]>([{ quantity: '', stock: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddQuantity = () => {
    setQuantities([...quantities, { quantity: '', stock: 0 }]);
  };

  const handleRemoveQuantity = (index: number) => {
    if (quantities.length > 1) {
      setQuantities(quantities.filter((_, i) => i !== index));
    }
  };

  const handleQuantityChange = (index: number, field: 'quantity' | 'stock', value: string | number) => {
    const updated = [...quantities];
    updated[index][field] = field === 'stock' ? Number(value) : value;
    setQuantities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      alert('Please enter product name');
      return;
    }

    const validQuantities = quantities.filter(
      (q) => q.quantity.trim() && q.stock >= 0
    );

    if (validQuantities.length === 0) {
      alert('Please add at least one valid quantity with stock');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/hardware/products`,
        {
          name: productName.trim(),
          quantities: validQuantities,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Product added successfully!');
      setProductName('');
      setQuantities([{ quantity: '', stock: 0 }]);
      navigate('/dashboard/hardware/products');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error adding product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Stock</h1>
        <p className="mt-2 text-gray-600">Add new products with their quantities and stock</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Paint, Cement, Steel"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Quantities & Stock
              </label>
              <button
                type="button"
                onClick={handleAddQuantity}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Add Quantity
              </button>
            </div>

            <div className="space-y-4">
              {quantities.map((qty, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (e.g., 1 kg, 500 ml, 2 liters)
                    </label>
                    <input
                      type="text"
                      value={qty.quantity}
                      onChange={(e) => handleQuantityChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1 kg, 500 ml"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock (Number)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={qty.stock}
                      onChange={(e) => handleQuantityChange(index, 'stock', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  {quantities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuantity(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/hardware/products')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ManageStock;

