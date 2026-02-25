# Guía para el Cliente: Crear Páginas SEO desde Wix

## Objetivo
Permitir que el cliente cree páginas como:
- `/muebles-restaurantes-cdmx`
- `/sillas-hoteles-monterrey`

**Sin tocar código. Todo desde el Dashboard de Wix.**

---

## Paso 1: Crear la Colección en Wix CMS

1. Ir a [manage.wix.com](https://manage.wix.com)
2. Seleccionar tu sitio
3. En el menú izquierdo, buscar **CMS** (o "Gestor de contenido")
4. Clic en **+ Crear colección**
5. Nombrarla: `LandingsSEO`
6. Agregar estos campos:

| Nombre del Campo | Tipo | Ejemplo |
|------------------|------|---------|
| `slug` | Texto | muebles-restaurantes-cdmx |
| `titulo` | Texto | Muebles para Restaurantes en CDMX |
| `subtitulo` | Texto | Mobiliario industrial de uso rudo |
| `descripcion` | Texto largo | Equipamos restaurantes... |
| `ciudad` | Texto | Ciudad de México |
| `estado` | Texto | CDMX |
| `keywords` | Texto | muebles restaurantes cdmx, sillas |

7. **Guardar** la colección

---

## Paso 2: Agregar Contenido

1. En la colección `LandingsSEO`, clic en **+ Agregar elemento**
2. Llenar los campos:
   - **slug**: `muebles-restaurantes-cdmx` (esto será la URL)
   - **titulo**: `Muebles para Restaurantes en CDMX` (H1 de la página)
   - **descripcion**: Texto SEO para Google
   - etc.
3. Guardar

**Repetir para cada ciudad/ubicación que quieras posicionar.**

---

## Paso 3: Permisos de la Colección

Para que Next.js pueda leer los datos:

1. En la colección, clic en **⚙️ Configuración**
2. En **Permisos**, configurar:
   - **¿Quién puede leer?** → **Cualquiera**
3. Guardar

---

## Resultado

Cuando el cliente agrega una fila nueva:
```
slug: sillas-cafeterias-guadalajara
titulo: Sillas para Cafeterías en Guadalajara
...
```

Next.js automáticamente crea la página:
```
https://restomueble.mx/sillas-cafeterias-guadalajara
```

**El cliente controla todo. El sitio se actualiza solo.**

---

## Diagrama del Flujo

```
CLIENTE (en Wix Dashboard)
         ↓
Agrega fila en CMS → "LandingsSEO"
         ↓
Next.js consulta API de Wix
         ↓
Genera página /[slug] automáticamente
         ↓
Google indexa la nueva página
```

---

## FAQ

**¿Cuánto tarda en aparecer la página nueva?**
Hasta 1 hora (por el cache ISR). En emergencias, puedes forzar un redeploy en Vercel.

**¿Puedo agregar imágenes?**
Sí, agrega un campo tipo "Imagen" en la colección.

**¿Hay límite de páginas?**
No hay límite práctico. Puedes crear cientos de landings.
