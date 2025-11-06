import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, Edit, Trash2, Save, Eye, Filter } from "lucide-react"
import Image from "next/image"

interface ProductsProps {
  activeTab?: string
}

export default function Products({ activeTab = "Products" }: ProductsProps) {
  const products = [
    {
      id: 1,
      name: "Toyota Genuine Oil Filter",
      category: "Filters",
      price: "₹450",
      stock: 25,
      sku: "TOY-OF-001",
      status: "In Stock",
      image: "/placeholder.svg?height=100&width=100",
      description: "Genuine Toyota oil filter for optimal engine performance",
    },
    {
      id: 2,
      name: "Toyota Floor Mats Set",
      category: "Accessories",
      price: "₹2,500",
      stock: 15,
      sku: "TOY-FM-002",
      status: "In Stock",
      image: "/placeholder.svg?height=100&width=100",
      description: "Premium quality floor mats designed for Toyota vehicles",
    },
    {
      id: 3,
      name: "Toyota Brake Pads",
      category: "Brake System",
      price: "₹3,200",
      stock: 8,
      sku: "TOY-BP-003",
      status: "Low Stock",
      image: "/placeholder.svg?height=100&width=100",
      description: "High-performance brake pads for enhanced safety",
    },
    {
      id: 4,
      name: "Toyota Air Freshener",
      category: "Accessories",
      price: "₹150",
      stock: 0,
      sku: "TOY-AF-004",
      status: "Out of Stock",
      image: "/placeholder.svg?height=100&width=100",
      description: "Official Toyota air freshener with pleasant fragrance",
    },
  ]

  const categories = [
    { name: "Filters", count: 12 },
    { name: "Accessories", count: 8 },
    { name: "Brake System", count: 6 },
    { name: "Engine Parts", count: 15 },
    { name: "Electrical", count: 10 },
  ]

  if (activeTab === "All Products") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Stock</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <Image
                          width={100} height={100} quality={100} unoptimized={true}
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <div className="font-medium text-sm text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-600">{product.category}</td>
                      <td className="py-4 px-2 text-sm font-semibold text-gray-900">{product.price}</td>
                      <td className="py-4 px-2 text-sm text-gray-600">{product.stock}</td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : product.status === "Low Stock"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeTab === "Add Product") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <Input placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea placeholder="Enter product description" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <Input placeholder="TOY-XXX-001" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <Input placeholder="₹0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                <Input placeholder="₹0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert</label>
                <Input type="number" placeholder="5" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <label className="text-sm text-gray-700">Track inventory</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <label className="text-sm text-gray-700">Active</label>
              </div>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeTab === "Product Categories") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
            <p className="text-sm text-gray-600">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.status === "In Stock").length}
            </h3>
            <p className="text-sm text-gray-600">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.status === "Low Stock").length}
            </h3>
            <p className="text-sm text-gray-600">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Package className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.status === "Out of Stock").length}
            </h3>
            <p className="text-sm text-gray-600">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 6).map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Image
                width={100} height={100} quality={100} unoptimized={true}
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">{product.price}</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
