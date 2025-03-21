"use client";
import { motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useEffect } from "react";

const Notification = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between gap-4 p-4 bg-primary text-white rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6" />
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition">
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default Notification;
