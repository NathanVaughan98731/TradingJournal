import { Link, Outlet, useLocation } from "react-router-dom"

const navItems = [
  { name: "Dashboard", path: "/" },
  { name: "Trades", path: "/trades" },
  { name: "Analytics", path: "/analytics" },
]

export function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Side Menu */}
      <aside className="w-56 bg-gray-900 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">Trading Journal</h1>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-800">
        <Outlet />
      </main>
    </div>
  )
}
