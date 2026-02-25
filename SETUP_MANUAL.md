# Guía de Configuración Manual (Paso a Paso)

Para conectar tu frontend Next.js con Wix, necesitas realizar estos pasos en el panel de Wix.

## Paso 1: Crear Proyecto Headless
1. Ve a [Wix Studio / Developers](https://dev.wix.com/).
2. Inicia sesión con tu cuenta de Wix.
3. Haz clic en **"Create New Project"** (o selecciona uno existente si ya tienes la tienda creada).
4. Selecciona **"Headless Project"**.

## Paso 2: Obtener Client ID (OAuth)
1. En el menú lateral izquierdo de tu proyecto, ve a **Settings** > **Headless Settings**.
2. Busca la sección **"OAuth Client ID"**.
3. Copia ese código alfanumérico (ej: `897s98-s7d87s-s7d8`).

## Paso 3: Configurar Redirecciones (IMPORTANTE)
Para que el login y el checkout funcionen en local, debes autorizar tu URL local.
1. En la misma pantalla de **Headless Settings**, busca **"Allowed Callback URLs"** o **"OAuth Redirect URLs"**.
2. Añade exactamente esta URL:
   `http://localhost:3000`
3. Guarda los cambios.

## Paso 4: Editar tu código
1. Abre el archivo que está en:  
   `d:\Workspace\Assets\Restomueble ecom\store\.env.local`
2. Pega tu Client ID donde dice `<TU_WIX_CLIENT_ID_AQUI>`.
   ```bash
   NEXT_PUBLIC_WIX_CLIENT_ID=tucodigo-copiado-de-wix
   NEXT_PUBLIC_URL=http://localhost:3000
   ```
3. Guarda el archivo.

---
**¿Listo?**
Una vez hecho esto, avísame para que pueda probar la conexión listando los productos de ejemplo.
