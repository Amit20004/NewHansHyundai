import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import Btn from "../../components/ui/Button";
import { useRouter } from "next/navigation";
const LocationCard = ({ name, address, phone, hours, type }) => {
  const router = useRouter();
  console.log(type);

  return (
    <div className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="!text-xl font-bold text-gray-900">{name}</h3>
          <span
            className={`px-3 py-1 rounded-sm !text-xs font-semibold tracking-wide ${
              type === "sales"
                ? "bg-blue-600 text-white"
                : "bg-orange-500 text-white"
            }`}
          >
            {type === "sales" ? "Sales" : "Service"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-50">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-600 leading-snug">{address}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-50">
              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </div>
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium !text-sm"
            >
              {phone}
            </a>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-50">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </div>
            <div className="text-gray-600 space-y-1 !text-sm">
              {hours.split(",").map((hour, index) => (
                <p key={index} className="leading-snug">
                  {hour.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        {/* <button className="text-blue-600 hover:text-blue-800 !text-sm font-semibold transition-colors">
          View Details
        </button> */}
        <Btn
          btnName={"View More"}
          func={() => {
            const slug = name
              .toLowerCase() // lowercase all letters
              .replace(/\s+/g, "-") // replace spaces with hyphens
              .replace(/[^\w-]+/g, ""); // remove any special characters
            router.push(`/location/${type}/${slug}`);
          }}
        />
      </div>
    </div>
  );
};

export default LocationCard;
