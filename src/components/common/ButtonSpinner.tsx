// src/components/common/ButtonSpinner.tsx
export default function ButtonSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}