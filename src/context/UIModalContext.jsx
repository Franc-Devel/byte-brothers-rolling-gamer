/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const UIModalContext = createContext();

export const UIModalProvider = ({ children }) => {
  const [modalActivo, setModalActivo] = useState(null);

  const abrirModal = useCallback((tipo) => setModalActivo(tipo), []);
  const cerrarModal = useCallback(() => setModalActivo(null), []);

  return (
    <UIModalContext.Provider value={{ modalActivo, abrirModal, cerrarModal }}>
      {children}
    </UIModalContext.Provider>
  );
};

export const useUIModal = () => {
  const context = useContext(UIModalContext);
  if (!context) throw new Error("useUIModal debe ser utilizado dentro de un UIModalProvider");
  return context;
};

export default UIModalContext;
