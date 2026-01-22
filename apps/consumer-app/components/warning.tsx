export const Warning = ({ message }: { message: React.ReactNode }) => {
  return (
    <div
      className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg"
      role="alert"
    >
      <div className="flex">
        <div className="shrink-0">⚠️</div>
        <div className="ml-3">{message}</div>
      </div>
    </div>
  );
};
