export default function SearchBar() {
  return (
    <div className="sticky top-0">
      <div className="relative h-36 rounded-md  shadow-sm    border border-gray-200 bg-white mb-12">
        <div className="flex py-2 px-6 justify-center">
          <div className="bg-white mr-4 h-14 rounded-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600 w-6/12">
            <label
              htmlFor="job-title"
              className="block text-xs font-medium text-gray-900"
            >
              Job Title
            </label>
            <input
              type="text"
              name="job-title"
              id="job-title"
              className="border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
              placeholder="Engineering Manager"
            />
          </div>
          <div className="w-6/12 ml-4 h-14  bg-white relative rounded-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
            <label
              htmlFor="job-title"
              className="block text-xs font-medium text-gray-900"
            >
              Location
            </label>
            <input
              type="text"
              name="job-title"
              id="job-title"
              className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
