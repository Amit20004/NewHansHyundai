import Image from "next/image"


export default function FacilityCard({ name, image }) {
  return (
    <div className="flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image 
          src={image || "/placeholder.svg"} 
          alt={name} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="!text-base font-semibold uppercase">{name}</h3>
      </div>
    </div>
  )
}