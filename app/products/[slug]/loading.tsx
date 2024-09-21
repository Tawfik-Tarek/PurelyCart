const Loading = () => {
  return (
    <div className="animate-pulse p-4 space-y-4 min-h-[calc(100dvh-100px)] flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12">
      <div className="flex-1">
        <div className="bg-gray-300 rounded-md h-80 w-full mb-4" />
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-300 rounded-md h-16 w-full" />
          <div className="bg-gray-300 rounded-md h-16 w-full" />
          <div className="bg-gray-300 rounded-md h-16 w-full" />
          <div className="bg-gray-300 rounded-md h-16 w-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-2">
        <div className="h-8 bg-gray-300 rounded w-3/4" />

        <div className="h-6 bg-gray-300 rounded w-1/2" />

        <div className="h-[1px] bg-gray-300 rounded my-2" />

        <div className="h-6 bg-gray-300 rounded w-1/3" />

        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
          <div className="h-4 bg-gray-300 rounded w-4/6" />
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
