"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface CataloguePopupContextType {
    isOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
}

const CataloguePopupContext = createContext<CataloguePopupContextType>({
    isOpen: false,
    openPopup: () => { },
    closePopup: () => { },
});

export const useCataloguePopup = () => useContext(CataloguePopupContext);

export const CataloguePopupProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    return (
        <CataloguePopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
            {children}
        </CataloguePopupContext.Provider>
    );
};
