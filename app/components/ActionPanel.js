"use client";
import { useRouter } from "next/navigation";
import { Car, MapPin, MessageCircle } from "lucide-react";



const ActionPanel = () => {
  const router = useRouter();

  const actions = [
    {
      label: "BOOK TEST DRIVE",
      icon: (
        <Car className="w-8 h-8  transition-colors duration-300" />
      ),
      href: "/test-drive",
    },
    {
      label: "FIND NEAREST DEALER",
      icon: (
        <MapPin className="w-8 h-8  transition-colors duration-300" />
      ),
      href: "/location",
    },
    {
      label: "CHAT WITH HH EXPERT",
      icon: (
        <MessageCircle className="w-8 h-8  transition-colors duration-300" />
      ),
      href: "/chat",
    },
  ];

  return (
    <div className="bg-[#05141f] w-full max-w-screen mx-auto mt-0  ">
      <div className="flex flex-row border-t border-b border-gray-300 bg-white action-panel ">
        {actions.map((action, idx) => (
          <div
            key={idx}
            onClick={() => action.href && router.push(action.href)}
            className={`flex-1 flex flex-col items-center justify-center py-4 px-3 sm:py-6 sm:px-4 cursor-pointer transition-all duration-300 
  ${idx !== actions.length - 1 ? "sm:border-r border-gray-300" : ""}
  ${idx !== actions.length - 1 ? "border-b sm:border-b-0 border-gray-300" : ""}
  text-[#013566] hover:bg-[#013566]  hover:text-white`}
          >
            <div className="mb-1 sm:mb-2 transition-colors duration-300 icons">
              {action.icon}
            </div>
            <p className="font-semibold text-center text-xs sm:text-sm uppercase tracking-wide leading-tight transition-colors duration-300">
              {action.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPanel;
