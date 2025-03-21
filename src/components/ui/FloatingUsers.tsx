import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FloatingUsers({ users }) {
  const [visible, setVisible] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 right-2 md:right-5 z-50 bg-white shadow-lg rounded-lg border border-gray-300 
          w-full max-w-[90vw] md:max-w-[500px] max-h-[400px] overflow-hidden"
        >
          <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
            <h2 className="text-sm md:text-lg font-semibold">Usuarios Conectados</h2>
            <button onClick={() => setVisible(false)} className="p-1">
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="overflow-x-auto max-h-[350px]">
            <table className="w-full text-xs md:text-sm text-left border-collapse">
              <thead className="bg-gray-200 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-2 border">Nombre</th>
                  <th className="p-2 border">Correo</th>
                  <th className="p-2 border">Contraseña</th>
                  <th className="p-2 border">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">{user.password}</td>
                    <td className="p-2 border text-gray-500 text-[10px] md:text-xs">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
