# Guía de Producción: Dominio, SEO y Gestión de Contenido

## 1. ¿Cómo el Cliente/Jefe Crea Páginas y Productos?

### Productos y Categorías (Páginas Dinámicas)
El cliente **NO necesita tocar código**. Todo se gestiona desde el Dashboard de Wix:

1. Ir a [manage.wix.com](https://manage.wix.com)
2. Seleccionar el sitio
3. Ir a **Tienda** → **Productos**
4. Crear/editar productos con:
   - Nombre
   - Descripción (SEO)
   - Precio
   - Imágenes
   - **Slug** (URL amigable, ej: "silla-industrial-negra")

**Resultado automático:** Cuando el cliente crea un producto en Wix, Next.js lo muestra automáticamente en:
- `/productos` (listado)
- `/producto/silla-industrial-negra` (página individual)

### Para que aparezca en Google:
Next.js genera automáticamente el HTML con:
- `<title>` = Nombre del producto + Restomueble
- `<meta description>` = Descripción del producto
- Open Graph para redes sociales

**El cliente solo gestiona contenido en Wix, el SEO se genera solo.**

---

## 2. ¿Cómo Tener un Dominio Profesional?

### Opción A: Vercel (Recomendada)
La forma más fácil de desplegar Next.js:

1. **Subir código a GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/restomueble.git
   git push -u origin main
   ```

2. **Conectar con Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Crear cuenta (gratis)
   - Clic en "Import Project"
   - Seleccionar el repositorio de GitHub
   - Configurar variables de entorno:
     - `NEXT_PUBLIC_WIX_CLIENT_ID` = tu Client ID

3. **Resultado:** Tu sitio estará en `restomueble.vercel.app`

4. **Conectar dominio propio:**
   - En Vercel → Settings → Domains
   - Agregar `restomueble.mx` o el dominio que tengas
   - Configurar DNS (Vercel te da las instrucciones)

---

## 3. ¿Puedo Usar el Mismo Dominio de Wix?

**Sí, pero con configuración DNS:**

### Escenario: Tienes `restomueble.mx` en Wix

Para Wix Headless, el dominio principal apunta a tu frontend (Vercel), 
y Wix queda "detrás" sirviendo datos.

| Dominio | Apunta a | Función |
|---------|----------|---------|
| `restomueble.mx` | Vercel | Frontend (Next.js) |
| `checkout.restomueble.mx` | Wix | Checkout seguro (automático) |
| API interna | Wix | Datos (productos, carrito) |

### Pasos:
1. En tu proveedor de dominio (GoDaddy, Namecheap, etc.):
   - Cambiar los nameservers a los de Vercel
   - O agregar registros A/CNAME que Vercel te indique

2. En Wix:
   - Ir a **Configuración** → **Dominios personalizados**
   - **No es necesario** conectar el dominio principal si usas Headless
   - El checkout usará automáticamente el dominio de Wix o un subdominio

### Flujo del Usuario:
```
Usuario visita → restomueble.mx (Vercel/Next.js)
                  ↓
Navega productos → Next.js consulta API de Wix
                  ↓
Hace checkout → Redirect a checkout de Wix (con tu branding si tienes Premium)
                  ↓
Paga → Wix procesa pago
                  ↓
Vuelve → restomueble.mx/gracias
```

---

## 4. Configuración de Variables de Entorno en Producción

En Vercel, ve a **Settings** → **Environment Variables** y agrega:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `NEXT_PUBLIC_WIX_CLIENT_ID` | `tu-client-id-real` | Production, Preview, Development |

---

## 5. SEO Checklist para Producción

### Automático (ya está hecho):
- [x] Metadata dinámica por producto (`generateMetadata`)
- [x] HTML renderizado del servidor (SSG/ISR)
- [x] URLs amigables (`/producto/[slug]`)

### Manual (debes hacer):
- [ ] Crear `sitemap.xml` dinámico
- [ ] Configurar `robots.txt`
- [ ] Agregar Google Search Console
- [ ] Configurar Google Analytics

### Crear Sitemap Dinámico
Crea este archivo para que Google indexe todos tus productos:

**Archivo:** `src/app/sitemap.ts` (ya lo creo abajo)

---

## 6. Resumen de Responsabilidades

| Tarea | Quién la hace | Dónde |
|-------|---------------|-------|
| Crear/editar productos | Cliente/Jefe | Dashboard Wix |
| Subir imágenes | Cliente/Jefe | Dashboard Wix |
| Definir precios | Cliente/Jefe | Dashboard Wix |
| Diseño del sitio | Desarrollador | Código Next.js |
| Desplegar cambios | Desarrollador | Vercel |
| SEO técnico | Automático | Next.js |
| Dominio/DNS | Una vez | Proveedor DNS |

---

## 7. Comandos de Despliegue

```bash
# Desarrollo local
npm run dev

# Build de producción (para probar)
npm run build
npm run start

# Desplegar a Vercel (automático con GitHub)
git add .
git commit -m "Update"
git push
# Vercel detecta el push y despliega automáticamente
```

---

## 8. Páginas SEO Programáticas (Ubicaciones, Nichos, etc.)

### ¿Qué son?
Páginas como:
- `/muebles-restaurantes-cdmx`
- `/sillas-taquerias-monterrey`
- `/mobiliario-hoteles-guadalajara`

Estas atraen tráfico local sin crear cada página a mano.

### Opción A: Usando Wix CMS (Content Manager)

1. En Wix Dashboard → **CMS** (o "Gestor de contenido")
2. Crear una **colección** llamada "Landing Pages SEO"
3. Campos:
   - `slug` (texto): "muebles-restaurantes-cdmx"
   - `titulo` (texto): "Muebles para Restaurantes en CDMX"
   - `descripcion` (texto largo): Contenido SEO
   - `ciudad` (texto): "Ciudad de México"
   - `imagen` (imagen)
4. El cliente agrega filas para cada ubicación

**Next.js lo consulta automáticamente** (ver implementación abajo).

### Opción B: Archivo JSON Local (Sin Wix CMS)

Crear un archivo `src/data/landings.json`:
```json
[
  {
    "slug": "muebles-restaurantes-cdmx",
    "titulo": "Muebles para Restaurantes en CDMX",
    "descripcion": "Sillas y mesas industriales...",
    "ciudad": "Ciudad de México"
  },
  {
    "slug": "sillas-cafeterias-monterrey",
    "titulo": "Sillas para Cafeterías en Monterrey",
    "descripcion": "Mobiliario resistente...",
    "ciudad": "Monterrey"
  }
]
```

### Implementación en Next.js

Estructura de carpeta:
```
src/app/
  └── [landing]/
      └── page.tsx    ← Página dinámica para SEO
```

La página `[landing]/page.tsx` lee el JSON o el CMS de Wix y genera páginas automáticamente.

---

## 9. Flujo para el Cliente/Jefe

| Acción | Dónde | Resultado |
|--------|-------|-----------|
| Agregar producto | Wix → Tienda → Productos | Aparece en `/producto/[slug]` |
| Crear landing SEO | Wix → CMS → "Landing Pages" | Aparece en `/[ciudad]-[nicho]` |
| Subir imágenes | Wix → Media Manager | Disponibles en el sitio |
| Cambiar precios | Wix → Tienda → Productos | Se actualiza automáticamente |

**Todo desde Wix. Cero código para el cliente.**
