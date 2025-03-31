import React from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotificationModal({ isOpen, onClose, title, message, type = "success" }) {
  if (!isOpen) return null;

  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  const iconColor = isError ? "text-red-600" : "text-green-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="mb-4 flex items-center gap-3">
          <Icon className={`h-6 w-6 ${iconColor}`} />
          <h3 className={`text-lg font-semibold ${isError ? "text-red-600" : "text-green-600"}`}>
            {title}
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>

        <div className="mt-6 flex justify-end">
          <Button
            variant={isError ? "destructive" : "default"}
            onClick={onClose}
            className="w-full"
          >
            {isError ? "Cerrar" : "Aceptar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal; 