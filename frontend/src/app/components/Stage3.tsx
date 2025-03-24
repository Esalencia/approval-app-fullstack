export default function Stage3() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#224057] mb-4">Stage 3: Building Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose of Building</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type of Industry (if industrial)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fire-fighting Equipment</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#224057] focus:ring-[#224057]"
            />
          </div>
        </div>
      </div>
    );
  }