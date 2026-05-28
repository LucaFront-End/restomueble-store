"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./HeroCarousel.css";

/* ── Slides data ── */
interface SlideBase {
    id: number;
    type?: "default" | "banner";
}

interface DefaultSlide extends SlideBase {
    type?: "default";
    preTitle: string;
    bgTitle: string;
    desc: string;
    cta: string;
    href: string;
    image: string;
    imageAlt: string;
}

interface BannerSlide extends SlideBase {
    type: "banner";
    desktopImage: string;
    mobileImage: string;
    alt: string;
    href: string;
}

type Slide = DefaultSlide | BannerSlide;

const SLIDES: Slide[] = [
    {
        id: 0,
        type: "banner",
        desktopImage: "/hero-hotsale-desktop.png",
        mobileImage: "/hero-hotsale-mobile.png",
        alt: "Hot Sale Josepja — Descuentos en mobiliario para restaurantes",
        href: "/tienda/ofertas",
    },
    {
        id: 1,
        type: "banner",
        desktopImage: "/hero-desde5-desktop.jpg",
        mobileImage: "/hero-desde5-mobile.jpg",
        alt: "Desde 5 piezas — Josepja mobiliario para restaurantes",
        href: "/tienda",
    },
    {
        id: 2,
        preTitle: "Mobiliario para restaurantes",
        bgTitle: "JOSEPJA",
        desc: "Fabricamos mobiliario industrial a medida para restaurantes, antros y hoteles. Diseño de autor, producción nacional.",
        cta: "Ver Catálogo",
        href: "/tienda",
        image: "/hero-josepja.png",
        imageAlt: "Silla industrial madera y metal — Josepja",
    },
    {
        id: 3,
        preTitle: "Mesas y sillas resistentes",
        bgTitle: "RESTAURANTES",
        desc: "Mesas y sillas fabricadas a medida para el ritmo de un restaurante. Resistentes, apilables y con diseño de autor.",
        cta: "Ver Sillas",
        href: "/tienda",
        image: "/hero-restaurante.png",
        imageAlt: "Colección de sillas para restaurante — Josepja",
    },
    {
        id: 4,
        preTitle: "Periqueras y bancos de barra",
        bgTitle: "ANTROS",
        desc: "Periqueras y bancos de barra con estructura de acero y madera. El statement que tu espacio nocturno necesita.",
        cta: "Ver Periqueras",
        href: "/tienda",
        image: "/hero-antro.png",
        imageAlt: "Periquera industrial para antro o bar — Josepja",
    },
    {
        id: 5,
        preTitle: "Mobiliario de gala",
        bgTitle: "EVENTOS",
        desc: "Sillas Tiffany y mobiliario de gala para bodas, banquetes y eventos corporativos. Elegancia que se renta.",
        cta: "Cotizar",
        href: "#concierge",
        image: "/hero-evento.png",
        imageAlt: "Silla Tiffany dorada para eventos — Josepja",
    },
];

const SLIDE_DURATION = 5000;

export default function HeroCarousel() {
    const heroRef = useRef<HTMLElement>(null);
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [transitioning, setTransitioning] = useState(false);

    /* ── Entrance animation (exactly like Velvet) ── */
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const timer = setTimeout(() => el.classList.add("hero-carousel--visible"), 50);
        return () => clearTimeout(timer);
    }, []);

    /* ── Slide transition ── */
    const goTo = (next: number) => {
        if (transitioning || next === current) return;
        setTransitioning(true);
        setPrev(current);
        setCurrent(next);
        setTimeout(() => {
            setPrev(null);
            setTransitioning(false);
        }, 700);
    };

    /* ── Auto-advance ── */
    useEffect(() => {
        const timer = setTimeout(() => {
            goTo((current + 1) % SLIDES.length);
        }, SLIDE_DURATION);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current, transitioning]);

    const slide = SLIDES[current];
    const prevSlide = prev !== null ? SLIDES[prev] : null;

    return (
        <section className="hero-carousel" ref={heroRef}>
            <div className="hero-carousel__inner">

                {/* ── Giant Background Title (only for default slides) ── */}
                {slide.type !== "banner" && (
                    <>
                        {/* Outgoing title */}
                        {prevSlide && prevSlide.type !== "banner" && (
                            <h1
                                key={`out-${prev}`}
                                className="hero-carousel__bg-title hero-carousel__bg-title--out"
                                aria-hidden="true"
                            >
                                <span className="hero-carousel__pre-title">{(prevSlide as DefaultSlide).preTitle}</span>
                                {(prevSlide as DefaultSlide).bgTitle}
                            </h1>
                        )}
                        {/* Incoming title */}
                        <h1
                            key={`in-${current}`}
                            className={`hero-carousel__bg-title${prevSlide ? " hero-carousel__bg-title--in" : ""}`}
                        >
                            <span className="hero-carousel__pre-title">{(slide as DefaultSlide).preTitle}</span>
                            {(slide as DefaultSlide).bgTitle}
                        </h1>
                    </>
                )}

                {/* ── Main Visual (Stage) — only for default slides ── */}
                {slide.type !== "banner" && (
                    <div className="hero-carousel__stage">
                        {/* Outgoing image */}
                        {prevSlide && prevSlide.type !== "banner" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={`img-out-${prev}`}
                                src={(prevSlide as DefaultSlide).image}
                                alt={(prevSlide as DefaultSlide).imageAlt}
                                className="hero-carousel__product-img hero-carousel__img--out"
                                draggable={false}
                                style={{ position: "absolute" }}
                            />
                        )}
                        {/* Incoming image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={`img-in-${current}`}
                            src={(slide as DefaultSlide).image}
                            alt={(slide as DefaultSlide).imageAlt}
                            className={`hero-carousel__product-img${prevSlide ? " hero-carousel__img--in" : ""}`}
                            draggable={false}
                        />
                    </div>
                )}

                {/* ── Split Bottom Content — only for default slides ── */}
                {slide.type !== "banner" && (
                    <div className="hero-carousel__bottom">
                        {/* Left Column: Description */}
                        <div className="hero-carousel__bottom-left">
                            <p
                                key={`desc-${current}`}
                                className="hero-carousel__desc hero-carousel__desc--in"
                            >
                                {(slide as DefaultSlide).desc}
                            </p>
                        </div>

                        {/* Right Column: CTA */}
                        <div className="hero-carousel__bottom-right">
                            <Link href={(slide as DefaultSlide).href} className="hero-carousel__cta-pill">
                                {(slide as DefaultSlide).cta}
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M1 11L11 1M11 1H3M11 1V9" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Slide Dots ── */}
                <div className="hero-carousel__dots">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            className={`hero-carousel__dot${i === current ? " hero-carousel__dot--active" : ""}`}
                            onClick={() => goTo(i)}
                            aria-label={`Diapositiva ${i + 1}: ${s.type === "banner" ? (s as BannerSlide).alt : (s as DefaultSlide).bgTitle}`}
                        >
                            <span
                                className="hero-carousel__dot-progress"
                                style={i === current ? { animationDuration: `${SLIDE_DURATION}ms` } : {}}
                            />
                        </button>
                    ))}
                </div>

            </div>

            {/* ── Banner Slide (full-bleed image — outside __inner to cover full section) ── */}
            {slide.type === "banner" && (
                <Link href={(slide as BannerSlide).href} className="hero-carousel__banner">
                    {/* Desktop image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        key={`banner-desktop-${current}`}
                        src={(slide as BannerSlide).desktopImage}
                        alt={(slide as BannerSlide).alt}
                        className={`hero-carousel__banner-img hero-carousel__banner-img--desktop${prevSlide ? " hero-carousel__img--in" : ""}`}
                        draggable={false}
                    />
                    {/* Mobile image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        key={`banner-mobile-${current}`}
                        src={(slide as BannerSlide).mobileImage}
                        alt={(slide as BannerSlide).alt}
                        className={`hero-carousel__banner-img hero-carousel__banner-img--mobile${prevSlide ? " hero-carousel__img--in" : ""}`}
                        draggable={false}
                    />
                </Link>
            )}

            {/* ── Marquee / Bottom Bar (hidden behind banner slides) ── */}
            <div className="hero-carousel__marquee" style={slide.type === "banner" ? { visibility: "hidden" } : {}}>
                <div className="hero-carousel__marquee-track">
                    {[...Array(2)].map((_, i) => (
                        <div className="hero-carousel__marquee-content" key={i}>
                            <span>RESTAURANTES</span><span className="star">✦</span>
                            <span>ANTROS</span><span className="star">✦</span>
                            <span>HOTELES</span><span className="star">✦</span>
                            <span>EVENTOS</span><span className="star">✦</span>
                            <span>FABRICACIÓN NACIONAL</span><span className="star">✦</span>
                            <span>DISEÑO A MEDIDA</span><span className="star">✦</span>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
