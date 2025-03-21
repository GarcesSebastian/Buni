"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect } from "react";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 p-4 bg-primary text-white rounded-lg shadow-lg"
    >
      <Bell className="w-6 h-6" />
      <p>{message}</p>
    </motion.div>
  );
};

export default Notification;
