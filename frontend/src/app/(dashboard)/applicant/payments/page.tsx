import Header from '@/app//components/Header'; // Import the Header component

export default function Payments() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#224057] mb-6">Payments</h1>

        {/* Payment Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#224057] mb-4">Payment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input
                type="text"
                value="INV-20240325-001"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057] bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount Due</label>
              <input
                type="text"
                value="$500.00"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057] bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="text"
                value="2024-04-01"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057] bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Make Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#224057] mb-4">Make Payment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]">
                <option>Credit Card</option>
                <option>Bank Transfer</option>
                <option>Mobile Money</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
                />
              </div>
            </div>
            <button className="bg-[#224057] text-white px-4 py-2 rounded-lg hover:bg-[#3A6B8A]">
              Pay Now
            </button>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#224057] mb-4">Payment History</h2>
          <div className="space-y-4">
            {/* Payment History Card */}
            <div className="border-l-4 border-[#224057] pl-4">
              <h3 className="text-lg font-semibold text-gray-700">Invoice: INV-20240320-001</h3>
              <p className="text-gray-600">Amount: <span className="font-bold">$500.00</span></p>
              <p className="text-gray-600">Status: <span className="text-green-600">Paid</span></p>
              <p className="text-gray-500">Paid on: 2024-03-20</p>
            </div>

            {/* Payment History Card */}
            <div className="border-l-4 border-[#224057] pl-4">
              <h3 className="text-lg font-semibold text-gray-700">Invoice: INV-20240315-001</h3>
              <p className="text-gray-600">Amount: <span className="font-bold">$300.00</span></p>
              <p className="text-gray-600">Status: <span className="text-green-600">Paid</span></p>
              <p className="text-gray-500">Paid on: 2024-03-15</p>
            </div>

            {/* Payment History Card */}
            <div className="border-l-4 border-[#224057] pl-4">
              <h3 className="text-lg font-semibold text-gray-700">Invoice: INV-20240310-001</h3>
              <p className="text-gray-600">Amount: <span className="font-bold">$200.00</span></p>
              <p className="text-gray-600">Status: <span className="text-green-600">Paid</span></p>
              <p className="text-gray-500">Paid on: 2024-03-10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}