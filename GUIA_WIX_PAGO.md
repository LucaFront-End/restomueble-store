# Guía Definitiva: Activar Pagos en Wix

Sigue estos pasos EXACTOS para desbloquear el checkout. No necesitas programar nada aquí, todo es en la web de Wix.

## Paso 1: Entrar al Panel de Control (Dashboard)
1. Abre esta URL: [https://manage.wix.com/](https://manage.wix.com/)
2. Inicia sesión con tu cuenta.
3. Verás una lista de "Sitios" o "Proyectos". Haz clic en el que estás usando (debería llamarse "My Site" o el nombre que le diste).

## Paso 2: Configurar Región y Moneda (Vital)
Si Wix no sabe dónde estás, no activa pagos.
1. En el menú de la izquierda, baja hasta el final y clic en **Ajustes** (Settings).
2. Clic en **Idioma y región** (Language & region).
3. Asegúrate de que **País** y **Moneda** estén correctos (ej: Argentina - Peso Argentino).
4. Guarda los cambios.

## Paso 3: Activar "Pagos Manuales" (Para pruebas)
Este es el método más fácil para probar sin tarjeta de crédito.
1. En **Ajustes**, clic en **Aceptar pagos** (Accept payments).
2. Baja hasta encontrar **Pagos manuales** (Manual Payments).
3. Clic en **Conectar** (Connect).
4. En el menú desplegable, elige "Pago en efectivo" o "Cash Payment".
5. Escribe unas instrucciones simples (ej: "Pagar al recibir").
6. **IMPORTANTE:** Clic en el botón **Conectar** o **Activar** al final. 
   > Si ya estaba conectado, desconéctalo y conéctalo de nuevo para asegurar.

## Paso 4: Publicar el Sitio (El paso secreto)
Aunque tu frontend sea Next.js, el "backend" de Wix necesita estar "Vivo".
1. En la parte **superior derecha** del Dashboard, busca un botón que diga **Editar sitio** (Edit Site).
   - *Nota: Si es un proyecto 100% headless puede que no tengas este botón. Si lo tienes, úsalo.*
2. Se abrirá el editor visual de Wix. Espera que cargue.
3. Una vez cargado, clic en el botón azul **Publicar** (Publish) en la esquina **superior derecha**.
4. Dale "Aceptar/Ver sitio".
5. Cierra el editor y vuelve al Dashboard.

## Paso 5: Prueba Final
Ahora vuelve a tu ecommerce local (localhost:3000):
1. Añade un producto al carrito.
2. Ve al checkout.
3. Debería dejarte pasar.

---

### ¿Sigues sin ver el botón "Editar sitio"?
Si creaste el proyecto desde `dev.wix.com` como "Headless puro", haz esto:
1. Ve a **Ajustes** > **Información del sitio** (Site Settings).
2. Busca el estado del sitio. Si dice "No publicado", busca el botón para publicarlo ahí.
