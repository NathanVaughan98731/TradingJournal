export function Button({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
    >
      {children}
    </button>
  )
}
