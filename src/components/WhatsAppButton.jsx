
import React from "react";
import { MessageCircle } from "lucide-react";

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/+528112345678"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export default WhatsAppButton;
