"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./HeroCarousel.css";

/* ── Slides data ── */
const SLIDES = [
    {
        id: 0,
        preTitle: "Mobiliario para hostelería",
        bgTitle: "JOSEPJA",
        desc: "Fabricamos mobiliario industrial a medida para restaurantes, antros y hoteles. Diseño de autor, producción nacional.",
        cta: "Ver Catálogo",
        href: "/tienda",
        image: "/hero-josepja.png",
        imageAlt: "Silla industrial madera y metal — Josepja",
    },
    {
        id: 1,
        preTitle: "Para tu restaurante",
        bgTitle: "RESTAURANTES",
        desc: "Mesas y sillas fabricadas a medida para el ritmo de un restaurante. Resistentes, apilables y con diseño de autor.",
        cta: "Ver Sillas",
        href: "/tienda",
        image: "/hero-restaurante.png",
        imageAlt: "Colección de sillas para restaurante — Josepja",
    },
    {
        id: 2,
        preTitle: "Para tu antro",
        bgTitle: "ANTROS",
        desc: "Periqueras y bancos de barra con estructura de acero y madera. El statement que tu espacio nocturno necesita.",
        cta: "Ver Periqueras",
        href: "/tienda",
        image: "/hero-antro.png",
        imageAlt: "Periquera industrial para antro o bar — Josepja",
    },
    {
        id: 3,
        preTitle: "Para tus eventos",
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

                {/* ── Background Title (Huge) — exactly like Velvet ── */}
                {/* Outgoing title */}
                {prevSlide && (
                    <h1
                        key={`out-${prev}`}
                        className="hero-carousel__bg-title hero-carousel__bg-title--out"
                        aria-hidden="true"
                    >
                        <span className="hero-carousel__pre-title">{prevSlide.preTitle}</span>
                        {prevSlide.bgTitle}
                    </h1>
                )}
                {/* Incoming title */}
                <h1
                    key={`in-${current}`}
                    className={`hero-carousel__bg-title${prevSlide ? " hero-carousel__bg-title--in" : ""}`}
                >
                    <span className="hero-carousel__pre-title">{slide.preTitle}</span>
                    {slide.bgTitle}
                </h1>

                {/* ── Main Visual (Stage) — exactly like Velvet ── */}
                <div className="hero-carousel__stage">
                    {/* Outgoing image */}
                    {prevSlide && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={`img-out-${prev}`}
                            src={prevSlide.image}
                            alt={prevSlide.imageAlt}
                            className="hero-carousel__product-img hero-carousel__img--out"
                            draggable={false}
                            style={{ position: "absolute" }}
                        />
                    )}
                    {/* Incoming image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        key={`img-in-${current}`}
                        src={slide.image}
                        alt={slide.imageAlt}
                        className={`hero-carousel__product-img${prevSlide ? " hero-carousel__img--in" : ""}`}
                        draggable={false}
                    />
                </div>

                {/* ── Split Bottom Content — exactly like Velvet ── */}
                <div className="hero-carousel__bottom">

                    {/* Left Column: Description */}
                    <div className="hero-carousel__bottom-left">
                        <p
                            key={`desc-${current}`}
                            className="hero-carousel__desc hero-carousel__desc--in"
                        >
                            {slide.desc}
                        </p>
                    </div>

                    {/* Right Column: CTA */}
                    <div className="hero-carousel__bottom-right">
                        <Link href={slide.href} className="hero-carousel__cta-pill">
                            {slide.cta}
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 11L11 1M11 1H3M11 1V9" />
                            </svg>
                        </Link>
                    </div>

                </div>

                {/* ── Slide Dots ── */}
                <div className="hero-carousel__dots">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            className={`hero-carousel__dot${i === current ? " hero-carousel__dot--active" : ""}`}
                            onClick={() => goTo(i)}
                            aria-label={`Diapositiva ${i + 1}: ${s.bgTitle}`}
                        >
                            <span
                                className="hero-carousel__dot-progress"
                                style={i === current ? { animationDuration: `${SLIDE_DURATION}ms` } : {}}
                            />
                        </button>
                    ))}
                </div>

            </div>

            {/* ── Marquee / Bottom Bar — exactly like Velvet ── */}
            <div className="hero-carousel__marquee">
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
