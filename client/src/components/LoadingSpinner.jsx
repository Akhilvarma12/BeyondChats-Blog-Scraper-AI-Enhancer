export function LoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4" />
      <div className="h-4 bg-gray-200 rounded-lg mb-4 w-1/4" />
      <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
    </div>
  );
}