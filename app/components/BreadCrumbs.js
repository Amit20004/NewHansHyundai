"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const BreadCrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm my-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-gray-600">
        {/* Home Link */}
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="text-white hover:text-amber-300 transition-colors font-bold"
          >
            Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          // Format segment text nicely
          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          // Disable link for non-page segments (e.g., intermediate folders like "beautification-service")
          const isValidPage =
            href === "/" || href === pathname; // Only make current page clickable if it exists

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-yellow-400" />

              {isLast || isValidPage ? (
                <span className="font-semibold text-white">{label}</span>
              ) : (
                <span className="text-white">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
