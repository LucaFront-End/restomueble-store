# Guía para el Cliente: Editar Contenido de la Web

## Objetivo
Permitir que el cliente edite:
- Títulos del Hero
- Textos de secciones
- Imágenes
- Teléfono, WhatsApp, Email
- Cualquier texto visible en la web

**Sin tocar código. Todo desde el Dashboard de Wix.**

---

## Paso 1: Crear la Colección "ContenidoWeb" en Wix

1. Ir a [manage.wix.com](https://manage.wix.com)
2. Seleccionar tu sitio
3. En el menú izquierdo → **CMS** (o "Gestor de contenido")
4. Clic en **+ Crear colección**
5. Nombrarla: `ContenidoWeb`
6. Agregar estos campos:

| Nombre del Campo | Tipo | Descripción |
|------------------|------|-------------|
| `clave` | Texto | Identificador único (ej: "hero_titulo") |
| `valor` | Texto largo | El contenido a mostrar |
| `tipo` | Texto | "texto", "imagen", "enlace" |

7. **Guardar** la colección

---

## Paso 2: Agregar el Contenido Inicial

Agregar filas para cada elemento editable:

### Sección Hero
| clave | valor | tipo |
|-------|-------|------|
| `hero_titulo` | Muebles hechos para el ritmo del restaurante | texto |
| `hero_subtitulo` | Sillas y mesas de uso rudo... | texto |
| `hero_badge` | +30 años fabricando en México | texto |

### Estadísticas
| clave | valor | tipo |
|-------|-------|------|
| `stat_anos` | 30+ | texto |
| `stat_restaurantes` | 500+ | texto |
| `stat_mexico` | 100% | texto |

### Contacto
| clave | valor | tipo |
|-------|-------|------|
| `telefono` | +52 55 1234 5678 | texto |
| `whatsapp` | 5512345678 | texto |
| `email` | info@restomueble.mx | texto |
| `direccion` | Ciudad de México, México | texto |

### Imágenes (URLs)
| clave | valor | tipo |
|-------|-------|------|
| `hero_imagen` | https://static.wixstatic.com/media/... | imagen |
| `logo` | https://static.wixstatic.com/media/... | imagen |

---

## Paso 3: Cómo Editar Contenido

1. Ir a WIx Dashboard → **CMS** → **ContenidoWeb**
2. Buscar la fila que quieres editar (por la columna `clave`)
3. Cambiar el `valor`
4. Guardar

**El cambio aparece en la web en máximo 1 hora** (o inmediato si se fuerza redeploy).

---

## Paso 4: Subir Nuevas Imágenes

1. En Wix Dashboard → **Media Manager**
2. Subir la imagen nueva
3. Clic derecho → **Copiar URL**
4. Pegar la URL en el campo `valor` de la imagen en ContenidoWeb

---

## Ejemplos de Edición

### Cambiar el título del Hero:
1. Buscar fila: `clave = hero_titulo`
2. Cambiar `valor` a: "Mobiliario industrial para tu negocio"
3. Guardar

### Cambiar el número de WhatsApp:
1. Buscar fila: `clave = whatsapp`
2. Cambiar `valor` a: "5598765432"
3. Guardar

### Cambiar imagen del Hero:
1. Subir imagen a Media Manager
2. Copiar URL
3. Buscar fila: `clave = hero_imagen`
4. Pegar URL en `valor`
5. Guardar

---

## FAQ

**¿Por qué tarda en aparecer el cambio?**
El sitio tiene cache de 1 hora para ser rápido. Los cambios aparecen en máximo 1 hora.

**¿Puedo agregar nuevas secciones?**
No directamente. Para nuevas secciones, contacta al desarrollador.

**¿Puedo romper algo?**
No. Solo estás editando contenido. Si algo sale mal, vuelve a poner el valor anterior.
