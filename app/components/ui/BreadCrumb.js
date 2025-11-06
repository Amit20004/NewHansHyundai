import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ paths }) => {
  return (
    <nav className="text-gray-600 text-sm flex items-center space-x-2" aria-label="Breadcrumb">
      {paths.map((path, index) => (
        <div className="flex items-center space-x-2" key={index}>
          {index !== 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {index < paths.length - 1 ? (
            <a
              href={path.href}
              className="hover:text-blue-600 hover:underline transition duration-200"
            >
              {path.label}
            </a>
          ) : (
            <span className="text-gray-800 font-medium">{path.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
