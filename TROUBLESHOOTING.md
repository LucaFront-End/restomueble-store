# Troubleshooting: Verificar Conexión Wix Headless

## Checklist Rápido

### 1. Test de Conexión (Terminal)
```bash
cd store
node test-connection.mjs
```
**Resultado esperado:**
```
✅ CONEXIÓN EXITOSA
Se encontraron X productos.
- Producto 1 ($xxx)
- Producto 2 ($xxx)
```

**Si falla:** Revisa que `.env.local` tenga el Client ID correcto.

---

### 2. Servidor de Desarrollo
```bash
npm run dev
```
Abre `http://localhost:3000`

| Página | Qué verificar |
|--------|---------------|
| `/` | ¿Ves productos en "Novedades"? |
| `/productos` | ¿Se lista el catálogo completo? |
| `/producto/[nombre]` | ¿Carga la ficha de producto? |

---

### 3. Carrito (Client-Side)
1. Entra a cualquier producto
2. Haz clic en **"Añadir al Carrito"**
3. Espera 2 segundos → Debe aparecer **"¡Añadido!"**
4. Revisa el ícono del carrito (Navbar) → Debería mostrar un número

**Si no funciona:**
- Abre DevTools (F12) → Console
- Busca errores rojos
- Error común: `401 Unauthorized` = Client ID incorrecto o dominio no autorizado

---

### 4. Checkout Redirect
1. Ve a `/carrito`
2. Haz clic en **"Finalizar Compra"**
3. Deberías ser redirigido a `checkout.wix.com` o similar

**Si no redirige:**
- Revisa la consola por errores
- Verifica que `http://localhost:3000` esté en las URLs permitidas de Wix

---

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `401 Unauthorized` | Client ID inválido o dominio bloqueado | Verifica `.env.local` y URLs permitidas en Wix |
| `INVALID_ARGUMENT: limit` | Pediste más de 100 productos | Usa `.limit(100)` máximo |
| `Cannot find module` | Dependencia faltante | Ejecuta `npm install` |
| Productos no cargan | ISR en caché viejo | Reinicia `npm run dev` o borra `.next` |
| Checkout no redirige | Cookies bloqueadas | Prueba en modo incógnito |

---

## Reset Completo (Si todo falla)
```bash
# Borrar caché y reinstalar
rm -rf .next node_modules
npm install
npm run dev
```

---

## Problema: "No aceptamos pagos" en Checkout

Este error viene de Wix, no del código. Verificar:

### 1. ¿El sitio de Wix está PUBLICADO?
- Ve a tu sitio en Wix Editor
- Haz clic en **Publicar** (esquina superior derecha)
- Un sitio no publicado no puede aceptar pagos

### 2. ¿Está la tienda conectada al proyecto Headless?
- Ve a `dev.wix.com` → Tu proyecto
- Verifica que el módulo **Wix Stores** esté añadido
- Si no está, añádelo desde el Marketplace de Wix

### 3. ¿Hay un método de pago ACTIVO?
Los "Pagos manuales" a veces no se activan correctamente.
- Ve a **Configuración** → **Aceptar pagos**
- Asegúrate de que diga "Activo" junto al método

### 4. ¿El producto tiene precio > $0?
Wix puede bloquear checkouts de productos sin precio válido.

### 5. ¿Hay restricciones de país/región?
- Ve a **Configuración** → **Envíos y cumplimiento**
- Verifica que tu país esté habilitado

### 6. Alternativa: Probar en Wix directamente
1. Entra a tu sitio de Wix desde el editor
2. Ve a la tienda y añade un producto al carrito
3. Intenta hacer checkout

Si también falla ahí, el problema es 100% de configuración de Wix, no del código headless.
