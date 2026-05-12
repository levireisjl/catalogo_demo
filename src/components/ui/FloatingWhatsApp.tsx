import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../../types';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-95"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
