export default function PaymentSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 rounded animate-pulse w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded animate-pulse w-1/3"></div>
      </div>
    </div>
  );
}