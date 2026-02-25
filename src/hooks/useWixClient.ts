"use client";

import { useContext } from "react";
import { WixContext } from "../context/wixContext";

export const useWixClient = () => {
    const { wixClient, isReady } = useContext(WixContext);
    return { wixClient, isReady };
};
