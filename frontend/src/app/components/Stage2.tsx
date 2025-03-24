export default function Stage2() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#224057] mb-4">Stage 2: Contractor and Architect Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contractor's Name and Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Architect's Name and Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Building Owner's Name and Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
        </div>
      </div>
    );
  }