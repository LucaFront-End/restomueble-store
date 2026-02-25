# Guía de Dominio: Usar el Mismo Dominio de Wix

## Contexto
Tienes un sitio Wix con dominio (ej: `restomueble.mx` o `restomueble.wixsite.com`).
Quieres que tu frontend Next.js use el **mismo dominio profesional**.

---

## Opción 1: Dominio Propio (Recomendada)

Si tienes un dominio comprado (`restomueble.mx`):

### Paso 1: Desplegar en Vercel
1. Subir código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/restomueble-store.git
   git push -u origin main
   ```

2. Ir a [vercel.com](https://vercel.com) y conectar el repositorio
3. Configurar variable de entorno:
   - `NEXT_PUBLIC_WIX_CLIENT_ID` = tu-client-id

4. Vercel te dará: `restomueble-store.vercel.app`

### Paso 2: Conectar tu Dominio
1. En Vercel → **Settings** → **Domains**
2. Agregar `restomueble.mx`
3. Vercel te dará instrucciones DNS:
   - Tipo: `A` → Valor: `76.76.21.21`
   - Tipo: `CNAME` → Valor: `cname.vercel-dns.com`

4. En tu proveedor de dominio (GoDaddy, Namecheap, etc.):
   - Cambiar los registros DNS según las instrucciones de Vercel

5. **Resultado**: `https://restomueble.mx` → Tu sitio Next.js

### ⚠️ Si el dominio está conectado a Wix:
1. En Wix Dashboard → **Configuración** → **Dominios**
2. **Desconectar** el dominio de Wix
3. Configurar DNS para Vercel (paso anterior)

El checkout de Wix seguirá funcionando porque usa su propia URL segura.

---

## Opción 2: Usar Subdominio

Si no quieres desconectar Wix del dominio principal:

| URL | Apunta a | Contenido |
|-----|----------|-----------|
| `restomueble.mx` | Wix | Sitio Wix (si lo quieres mantener) |
| `tienda.restomueble.mx` | Vercel | Tu frontend Next.js |

### Configuración:
1. En tu proveedor DNS, agregar:
   - `CNAME tienda → cname.vercel-dns.com`
2. En Vercel → Domains → agregar `tienda.restomueble.mx`

---

## Opción 3: Solo Vercel (Sin Dominio Propio)

Si no tienes dominio propio, usarás la URL de Vercel:
- `restomueble.vercel.app` (gratuito)

Puedes comprar un dominio después y conectarlo.

---

## ¿Qué pasa con el Checkout de Wix?

El checkout **siempre usa los servidores de Wix** (es donde se procesan pagos).
El usuario será redirigido a una URL de Wix temporalmente:
```
Tu sitio (Vercel)                  Checkout (Wix)
restomueble.mx                 →   checkout.wix.com/...
                               ←   restomueble.mx/gracias
```

Esto es normal y seguro. Wix maneja los pagos.

---

## Variables de Entorno en Producción

En Vercel → Settings → Environment Variables:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_WIX_CLIENT_ID` | Tu Client ID de Wix |
| `NEXT_PUBLIC_SITE_URL` | `https://restomueble.mx` |

---

## Resumen de Pasos

1. ✅ Subir código a GitHub
2. ✅ Conectar GitHub a Vercel
3. ✅ Configurar variables de entorno en Vercel
4. ✅ Agregar dominio en Vercel
5. ✅ Configurar DNS (quitar de Wix, apuntar a Vercel)
6. ✅ Esperar propagación DNS (hasta 48h, usualmente minutos)

**Resultado Final:**
- `restomueble.mx` → Tu sitio Next.js profesional
- Productos/CMS → Se gestionan desde Wix Dashboard
- Checkout → Wix (automático y seguro)
