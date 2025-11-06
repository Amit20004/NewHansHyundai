import Image from "next/image"
export default function ContactPersonCard({ name, title, email, phone, image }) {
  return (
    <div className="flex flex-col items-center p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg border border-gray-200 bg-white">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={100}
        height={100}
        className="rounded-full object-cover mb-4 w-[100px] h-[100px]"
      />
      <div className="p-0 space-y-2">
        <h3 className="!text-lg font-semibold uppercase">{name}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-sm text-[#e31e24] break-words">{email}</p>
        <p className="text-sm text-[#e31e24]">{phone}</p>
      </div>
    </div>
  )
}