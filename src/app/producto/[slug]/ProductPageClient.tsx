"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { ProductInfo } from "@/components/catalogue/ProductInfo";
import AddToCart from "./AddToCart";
import ColorSelector from "./ColorSelector";
import ShippingCalculator from "@/components/ShippingCalculator";
import DeliveryConditions from "@/components/DeliveryConditions";
import type { ColorCombination } from "@/lib/wixCmsColores";

interface ProductPageClientProps {
    product: any; // Raw Wix Product — types are all-optional with nulls
    colorData?: ColorCombination[];
}

export default function ProductPageClient({ product, colorData = [] }: ProductPageClientProps) {
    const mainImage = product.media?.mainMedia?.image?.url || "/placeholder-product.png";
    const gallery = product.media?.items || [];
    const basePrice = product.priceData?.formatted?.price || "$0";

    // Reactive state: price & image change when a variant is selected
    const [currentPrice, setCurrentPrice] = useState(basePrice);
    const [externalImage, setExternalImage] = useState<string | undefined>(undefined);

    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
            {/* Left: Gallery */}
            <ProductGallery
                mainImage={mainImage}
                gallery={gallery}
                productName={product.name || "Producto"}
                externalSelectedImage={externalImage}
            />

            {/* Right: Info (Sticky) */}
            <div className="relative">
                <ProductInfo
                    title={product.name || "Producto"}
                    price={currentPrice}
                    description={product.description || ""}
                >
                    <AddToCart
                        productId={product._id || ""}
                        productName={product.name || ""}
                        productOptions={product.productOptions || []}
                        variants={product.variants || []}
                        onPriceChange={(formattedPrice) => setCurrentPrice(formattedPrice)}
                        onImageChange={(imageUrl) => setExternalImage(imageUrl)}
                    />

                    {/* Color/Material selectors — visual only, no price impact */}
                    <ColorSelector
                        colorData={colorData}
                        onImageChange={(imageUrl) => setExternalImage(imageUrl)}
                    />

                    <ShippingCalculator />
                    <DeliveryConditions />
                </ProductInfo>
            </div>
        </div>
    );
}

