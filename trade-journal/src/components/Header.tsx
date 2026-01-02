import { NavLink } from "react-router-dom"

export function Header() {
  return (
    <header className="bg-gray-800 p-4 flex gap-6">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `text-white font-semibold ${isActive ? "text-blue-400" : ""}`
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/trades"
        className={({ isActive }) =>
          `text-white font-semibold ${isActive ? "text-blue-400" : ""}`
        }
      >
        Trades
      </NavLink>
      <NavLink
        to="/strategies"
        className={({ isActive }) =>
          `text-white font-semibold ${isActive ? "text-blue-400" : ""}`
        }
      >
        Strategies
      </NavLink>
    </header>
  )
}
