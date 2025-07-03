import { Link } from "react-router-dom"
import { PlusIcon, PlayIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import { UserButton } from "@stackframe/react"

export default function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <PlayIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">DemoForge</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/analytics" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ChartBarIcon className="w-4 h-4 mr-1" />
              Analytics
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Demo
            </Link>

            <UserButton
              showUserInfo={true}
              extraItems={[
                {
                  text: "Account Settings",
                  icon: <ChartBarIcon className="w-4 h-4" />,
                  onClick: () => (window.location.href = "/account"),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
