const SkeletonProduct = () => {
  return (
    <div className="animate-pulse p-4 border border-gray-200 rounded-lg space-y-4 w-full">
      <div className="bg-gray-300 rounded-md h-48 w-full mb-4" />

      <div className="h-4 bg-gray-300 rounded w-3/4" />

      <div className="h-4 bg-gray-300 rounded w-1/2" />

      <div className="flex gap-2 mt-2">
        <div className="h-4 w-10 bg-gray-300 rounded-full" />
        <div className="h-4 w-10 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonProduct;
