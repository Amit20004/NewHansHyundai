"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Edit, Trash } from "lucide-react"
import Image from "next/image"

export default function HomeServicesAdmin() {
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [serviceName, setServiceName] = useState("")
  const [imageFile, setImageFile] = useState(null)

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/home-services")
      setServices(res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSave = async () => {
    const form = new FormData()
    form.append('serviceName', serviceName)
    if (imageFile) form.append('image', imageFile)

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/home-services/${editingId}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('Updated successfully')
      } else {
        await axios.post('http://localhost:8000/api/home-services', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('Added successfully')
      }
      setServiceName('')
      setImageFile(null)
      setEditingId(null)
      fetchServices()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  const handleEdit = (service) => {
    setServiceName(service.serviceName)
    setEditingId(service.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    await axios.delete(`http://localhost:8000/api/home-services/${id}`)
    fetchServices()
  }

  return (
    <div className="p-6 space-y-6 mt-5">
      {/* Table */}
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Service Name</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{s.serviceName}</td>
              <td className="px-4 py-2">
                {s.imageUrl ? (
                  <Image width={100} height={100} quality={100} unoptimized={true}  src={`http://localhost:8000${s.imageUrl}`} alt="service" className="w-16 h-16 object-cover rounded" />
                ) : 'No image'}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => handleEdit(s)} className="text-green-600"><Edit className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(s.id)} className="text-red-600"><Trash className="w-4 h-4"/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form */}
      <div className="border p-4 rounded bg-gray-50 space-y-3">
        <h2 className="font-bold text-xl">{editingId ? "Edit" : "Add"} Service</h2>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Service Name"
          value={serviceName}
          onChange={e => setServiceName(e.target.value)}
        />
        <input type="file" className="border p-2 w-full" onChange={e => setImageFile(e.target.files[0])} />
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSave}>{editingId ? "Update" : "Save"}</button>
          {editingId && (
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => {setEditingId(null); setServiceName(''); setImageFile(null)}}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  )
}
