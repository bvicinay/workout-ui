export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full" />
    </div>
  );
}
