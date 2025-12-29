import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  quantities: { quantity: string; stock: number }[];
}

interface BillItem {
  productId: string;
  productName: string;
  quantity: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
}

function Bill() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('');
  const [count, setCount] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
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
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || !selectedQuantity || count <= 0 || unitPrice <= 0) {
      alert('Please fill all fields correctly');
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const quantityObj = product.quantities.find((q) => q.quantity === selectedQuantity);
    if (!quantityObj || quantityObj.stock < count) {
      alert('Insufficient stock');
      return;
    }

    const newItem: BillItem = {
      productId: selectedProduct,
      productName: product.name,
      quantity: selectedQuantity,
      count,
      unitPrice,
      totalPrice: count * unitPrice,
    };

    setBillItems([...billItems, newItem]);
    setSelectedProduct('');
    setSelectedQuantity('');
    setCount(1);
    setUnitPrice(0);
  };

  const handleRemoveItem = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const dueAmount = totalAmount - paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (billItems.length === 0) {
      alert('Please add at least one item');
      return;
    }
    if (!customerName || !phoneNumber) {
      alert('Please fill customer details');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/hardware/bills`,
        {
          items: billItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            count: item.count,
            unitPrice: item.unitPrice,
          })),
          customerName,
          phoneNumber,
          paidAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Bill created successfully!');
      // Reset form
      setBillItems([]);
      setCustomerName('');
      setPhoneNumber('');
      setPaidAmount(0);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating bill');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProductObj = products.find((p) => p._id === selectedProduct);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Bill</h1>
        <p className="mt-2 text-gray-600">Add products and generate bill for customer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Product Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setSelectedQuantity('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Quantity
                </label>
                <select
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Quantity</option>
                  {selectedProductObj.quantities.map((qty, index) => (
                    <option key={index} value={qty.quantity}>
                      {qty.quantity} (Stock: {qty.stock})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Count
              </label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Bill Items */}
        {billItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bill Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Product</th>
                    <th className="text-left py-2 px-4">Quantity</th>
                    <th className="text-left py-2 px-4">Count</th>
                    <th className="text-left py-2 px-4">Unit Price</th>
                    <th className="text-left py-2 px-4">Total</th>
                    <th className="text-left py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.productName}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">{item.count}</td>
                      <td className="py-2 px-4">₹{item.unitPrice}</td>
                      <td className="py-2 px-4">₹{item.totalPrice}</td>
                      <td className="py-2 px-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Amount:</span>
              <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Paid Amount:</span>
              <span className="font-semibold">₹{paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-semibold">
                {dueAmount <= 0 ? 'Fully Paid' : 'Due Amount:'}
              </span>
              <span
                className={`font-bold ${dueAmount <= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {dueAmount <= 0 ? '✓' : `₹${dueAmount.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || billItems.length === 0}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating Bill...' : 'Create Bill'}
        </button>
      </form>
    </div>
  );
}

export default Bill;

