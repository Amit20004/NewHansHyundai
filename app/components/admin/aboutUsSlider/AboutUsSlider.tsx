import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, Edit, Trash2, Save, Eye } from "lucide-react"
import Image from "next/image"

export default function AboutUsSlider() {
  const slides = [
    {
      id: 1,
      title: "Our Story",
      description: "Over 20 years of excellence in automotive sales and service",
      image: "/placeholder.svg?height=300&width=600",
      order: 1,
      status: "Active",
    },
    {
      id: 2,
      title: "Expert Team",
      description: "Certified professionals dedicated to your automotive needs",
      image: "/placeholder.svg?height=300&width=600",
      order: 2,
      status: "Active",
    },
    {
      id: 3,
      title: "Customer Satisfaction",
      description: "Thousands of happy customers trust Galaxy Toyota",
      image: "/placeholder.svg?height=300&width=600",
      order: 3,
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">About Us Slider</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Slides */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              About Us Slides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <Image
                    width={100} height={100} quality={100} unoptimized={true}
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{slide.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">Order: {slide.order}</span>
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {slide.status}
                            </span>
                          </div>
                        </div>
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Slide Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Slide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slide Title</label>
              <Input placeholder="Enter slide title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea placeholder="Enter slide description" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <Input type="number" placeholder="1" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <label className="text-sm text-gray-700">Active</label>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Slide
            </Button>
          </CardContent>
        </Card>

        {/* Slider Settings */}
        <Card>
          <CardHeader>
            <CardTitle>About Slider Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <Input defaultValue="About Galaxy Toyota" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
              <Input defaultValue="Your Trusted Toyota Partner" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto-play Duration (seconds)</label>
              <Input type="number" defaultValue="6" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <label className="text-sm text-gray-700">Enable auto-play</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <label className="text-sm text-gray-700">Show on About page</label>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
