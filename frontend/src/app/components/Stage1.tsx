export default function Stage1() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#224057] mb-4">Stage 1: Property Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stand No.</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Postal Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Cost of Building</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
        </div>
      </div>
    );
  }