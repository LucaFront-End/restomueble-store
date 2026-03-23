/**
 * Convierte URLs de imagen de Wix (formato interno) a URLs HTTP válidas.
 * Wix a veces devuelve imágenes en formato: wix:image://v1/...
 * Este helper extrae el mediaId y construye una URL estática simple.
 */
export function getWixImageUrl(wixImageUrl: string | undefined): string | null {
    if (!wixImageUrl) return null;

    // Si ya es una URL HTTP, devolverla tal cual
    if (wixImageUrl.startsWith("http")) {
        return wixImageUrl;
    }

    // Formato: wix:image://v1/{mediaId}/{filename}#originWidth=...
    if (wixImageUrl.startsWith("wix:image://")) {
        const match = wixImageUrl.match(/wix:image:\/\/v1\/([^/]+)\//);
        if (match && match[1]) {
            const mediaId = match[1];
            return `https://static.wixstatic.com/media/${mediaId}`;
        }
    }

    return null;
}
