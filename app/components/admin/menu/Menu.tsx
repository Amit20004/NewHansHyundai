import { MenuIcon, Plus, Edit, Trash2, Save } from "lucide-react"

export default function Menu() {
  const menuItems = [
    { id: 1, title: "Home", url: "/", order: 1, status: "Active", parent: null },
    { id: 2, title: "Cars", url: "/cars", order: 2, status: "Active", parent: null },
    { id: 3, title: "New Cars", url: "/cars/new", order: 1, status: "Active", parent: 2 },
    { id: 4, title: "Used Cars", url: "/cars/used", order: 2, status: "Active", parent: 2 },
    { id: 5, title: "Services", url: "/services", order: 3, status: "Active", parent: null },
    { id: 6, title: "About", url: "/about", order: 4, status: "Active", parent: null },
    { id: 7, title: "Contact", url: "/contact", order: 5, status: "Active", parent: null },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Menu Structure */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MenuIcon className="h-5 w-5" />
              Current Menu Structure
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {menuItems
                .filter((item) => !item.parent)
                .map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{item.title}</span>
                        <span className="text-sm text-gray-500">({item.url})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {/* Sub-menu items */}
                    {menuItems
                      .filter((subItem) => subItem.parent === item.id)
                      .map((subItem) => (
                        <div
                          key={subItem.id}
                          className="flex items-center justify-between p-2 ml-6 bg-white border rounded"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-700">{subItem.title}</span>
                            <span className="text-xs text-gray-500">({subItem.url})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="h-6 w-6 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center">
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="h-6 w-6 p-0 bg-transparent border-none cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Add/Edit Menu Item */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Menu Item</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu Title</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter menu title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/page-url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent Menu</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None (Top Level)</option>
                <option value="2">Cars</option>
                <option value="5">Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                placeholder="1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <label className="text-sm text-gray-700">Active</label>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save Menu Item
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
