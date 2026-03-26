"use client";

import { createContext, ReactNode, useContext, useState, useEffect } from "react";

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
    const closePopup = () => {
        setIsOpen(false);
        // Mark as shown so it doesn't reappear in the same session
        try { sessionStorage.setItem("josepja_popup_shown", "1"); } catch {}
    };

    // Auto-open popup on first visit (per session)
    useEffect(() => {
        try {
            const alreadyShown = sessionStorage.getItem("josepja_popup_shown");
            if (!alreadyShown) {
                // Show after a short delay so the page loads first
                const timer = setTimeout(() => setIsOpen(true), 3000);
                return () => clearTimeout(timer);
            }
        } catch {}
    }, []);

    return (
        <CataloguePopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
            {children}
        </CataloguePopupContext.Provider>
    );
};
