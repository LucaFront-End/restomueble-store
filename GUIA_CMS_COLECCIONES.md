# Guía de Colecciones CMS — Wix Dashboard

## Colección: Leads ✅ (ya creada y funcionando)
Campos: `nombre`, `email`, `telefono`, `ciudad`, `cantidad`, `producto`, `origen`, `fecha`

---

## Colección: Negocios ( Clientes) ✅ (ya creada por tu jefe)
> Se usa para la página de **Proyectos** (`/proyectos`) y el **carrusel de clientes** en la home.

**Campos existentes:**
| Campo | Uso en el sitio |
|-------|----------------|
| `Nombre de Restaurante` | Nombre del proyecto + nombre en el carrusel |
| `Ciudad` | Ubicación del proyecto |
| `Tipo de Restaurante` | Categoría (Taquería, Bar, etc.) |
| `Imagen de Portada` | Foto del proyecto |
| `Galería de fotos del negocio` | (disponible para futuro uso) |
| `Excerpt del negocio proyecto` | Descripción corta |
| `Principal en la página` | Si aparece en la home |

**Para que se vean bien los proyectos, completar:**
1. Subir una **Imagen de Portada** para cada negocio
2. Llenar **Ciudad** y **Tipo de Restaurante**
3. Opcionalmente marcar `Principal en la página = true` para destacar

---

## Colección: Espacios
> Aparecen en la sección "Catálogo" de la home (máximo 4 con `principal = true`)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `titulo` | Text | FIRME |
| `subtitulo` | Text | Mesas y bases de estabilidad superior |
| `imagen` | Image | Foto lifestyle |
| `enlace` | Text (URL) | /productos/mesas |
| `principal` | Boolean | true |
| `orden` | Number | 1 |

---

## Permisos de Colecciones
Para que el sitio pueda leer las colecciones:
1. Ve a cada colección → ⋮ → **Permisos**
2. **"¿Quién puede leer contenido?"** → **Cualquiera**
3. Para Leads: **"¿Quién puede agregar contenido?"** → **Cualquiera**

## Automación de Email (Leads)
1. Wix Dashboard → **Automatizaciones** → **Nueva automatización**
2. Disparador: "Un elemento nuevo se crea en la colección **Leads**"
3. Acción: "Enviar email a **ventas@josepja.com**"
4. Incluir campos: nombre, email, telefono, ciudad, origen, producto

## ⚠️ Nota sobre el ID de colección
Si los proyectos no cargan del CMS, puede ser que el ID de la colección sea diferente.
Para encontrarlo: ve a **Wix Dashboard → CMS → Negocios ( Clientes)** → la URL mostrará el ID.
Debería ser algo como `Negocios-(-Clientes)` o `Negocios`. Si es diferente, actualizar en:
- `src/app/(site)/proyectos/page.tsx` (línea del query)
- `src/app/(site)/page.tsx` (línea del query de negociosResult)

---

## Colección: LandingsSEO — Campo FAQs

> Las landings dinámicas (`/mesas-para-restaurantes-en-monterrey`, etc.) soportan FAQs personalizadas.

### Cómo agregar FAQs a una landing:

1. Ve a **Wix Dashboard → CMS → LandingsSEO**
2. Si no existe el campo `faqs`, crealo:
   - Click **"+ Agregar campo"** → Tipo: **Texto largo (multiline)**
   - Nombre del campo: `faqs`
3. En cada landing, pegá un JSON con el formato:

```json
[
  {"q": "¿Hacen envíos a Monterrey?", "a": "Sí, realizamos envíos a Monterrey y todo Nuevo León. El tiempo de entrega es de 5-10 días hábiles."},
  {"q": "¿Qué garantía tienen los muebles?", "a": "Garantía de 12 meses contra defectos de fabricación. Acero calibre 16, soldadura MIG y acabados resistentes."},
  {"q": "¿Puedo personalizar los muebles?", "a": "Sí. Ofrecemos personalización de colores, medidas y acabados."},
  {"q": "¿Cuál es el pedido mínimo?", "a": "No hay pedido mínimo para catálogo. Para proyectos personalizados, mínimo 10 piezas."}
]
```

### Reglas:
- Cada FAQ es un objeto con `"q"` (pregunta) y `"a"` (respuesta)
- El campo acepta cualquier cantidad de FAQs
- Si el campo está vacío, se usan FAQs por defecto automáticamente
- **El JSON debe ser válido** — usá un validador como jsonlint.com si tenés dudas

