export default function Loading() {
  return (
    <div className="h-[calc(100vh-48px)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      <p className="text-center text-gray-500">page下的loading</p>
    </div>
  )
}
