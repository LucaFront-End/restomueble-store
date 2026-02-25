const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function resolveUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${STRAPI_URL}${url}`;
}

function mediaUrl(media: any): string {
  const url = media?.data?.attributes?.url;
  return resolveUrl(url);
}

export async function getHomeFromStrapi() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/home?populate=deep`, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.attributes || null;
  } catch {
    return null;
  }
}

export function mapHomeToProps(home: any) {
  if (!home) return null;

  const hero = {
    overline: home.heroOverline || "",
    titulo: home.heroTitulo || "",
    subtitulo: home.heroSubtitulo || "",
    imagenFondo: mediaUrl(home.heroImagen),
    stats: Array.isArray(home.heroStats) ? home.heroStats.map((s: any) => ({
      numero: s.numero || "",
      label: s.label || "",
    })) : [],
    ctaPrimario: {
      texto: home.heroCtaPrimarioTexto || "",
      url: home.heroCtaPrimarioUrl || "",
    },
    ctaSecundario: {
      texto: home.heroCtaSecundarioTexto || "",
      url: home.heroCtaSecundarioUrl || "",
    },
  };

  const categories = {
    tag: home.categoriesTag || "",
    title: home.categoriesTitle || "",
    description: home.categoriesDescription || "",
    list: Array.isArray(home.categoriesList) ? home.categoriesList.map((c: any) => ({
      nombre: c.nombre || "",
      descripcion: c.descripcion || "",
      imagen: mediaUrl(c.imagen),
      link: c.link || "",
    })) : [],
  };

  const benefits = Array.isArray(home.benefitsList)
    ? home.benefitsList.map((b: any) => ({
        titulo: b.titulo || "",
        descripcion: b.descripcion || "",
      }))
    : [];

  const projects = {
    title: home.projectsTitle || "",
    subtitle: home.projectsSubtitle || "",
    list: Array.isArray(home.projectsList) ? home.projectsList.map((p: any) => ({
      nombre: p.nombre || "",
      ubicacion: p.ubicacion || "",
      categoria: p.categoria || "",
      imagen: mediaUrl(p.imagen),
    })) : [],
  };

  const about = {
    historiaTitle: home.aboutHistoriaTitle || "",
    historiaTexto: home.aboutHistoriaTexto || "",
    historiaImagen: mediaUrl(home.aboutHistoriaImagen),
    misionTitle: home.aboutMisionTitle || "",
    misionTexto: home.aboutMisionTexto || "",
    misionImagen: mediaUrl(home.aboutMisionImagen),
    valoresTitle: home.aboutValoresTitle || "",
    valoresTexto: home.aboutValoresTexto || "",
    valoresImagen: mediaUrl(home.aboutValoresImagen),
    stats: Array.isArray(home.aboutStats) ? home.aboutStats.map((s: any) => ({
      numero: s.numero || "",
      label: s.label || "",
    })) : [],
  };

  const logos = {
    label: home.logosLabel || "",
    list: Array.isArray(home.logosList) ? home.logosList.map((l: any) => ({
      nombre: l.nombre || "",
      logo: mediaUrl(l.logo),
    })) : [],
  };

  const cta = {
    emailDestino: home.ctaEmailDestino || "",
  };

  const footer = {
    slogan: home.footerSlogan || "",
    email: home.footerEmail || "",
    telefono: home.footerTelefono || "",
    direccion: home.footerDireccion || "",
    horario: home.footerHorario || "",
    redesSociales: {
      instagram: home.footerInstagram || "",
      facebook: home.footerFacebook || "",
      linkedin: home.footerLinkedin || "",
      whatsapp: home.footerWhatsapp || "",
    },
    copyrightText: home.footerCopyright || "",
    creditsText: home.footerCredits || "",
  };

  return { hero, categories, benefits, projects, about, logos, cta, footer };
}
