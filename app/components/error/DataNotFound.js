import { AlertCircle } from "lucide-react";
// import { Button } from "../ui/Button";


 const ErrorMessage = ({ 

  msg
}) => {
  return (
    <div className="flex flex-row w-full mt-5 items-center justify-center p-2 text-center space-x-2.5  border-5 border-red-600 max-w-full mx-auto">
      <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-error-text" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Error : 
      </h3>
      
      <p className="text-error-text mb-6 leading-relaxed">
        {msg}
      </p>
      
     
    </div>
  );
};
export default ErrorMessage;