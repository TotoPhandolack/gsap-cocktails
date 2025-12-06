'use client'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { useRef } from "react"
import { useMediaQuery } from "react-responsive"

gsap.registerPlugin(ScrollTrigger, SplitText)

const Hero = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const isMobile = useMediaQuery({ maxWidth: 767 })


    useGSAP(() => {
        const heroSplit = new SplitText('.title', { type: 'chars, words' });
        const paragraphSplit = new SplitText('.subtitle', { type: 'lines' });

        heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

        gsap.from(heroSplit.chars, {
            yPercent: 100,
            duration: 1.8,
            ease: 'expo.out',
            stagger: 0.05,
        });

        gsap.from(paragraphSplit.lines, {
            opacity: 0,
            yPercent: 100,
            duration: 1.8,
            ease: 'expo.out',
            stagger: 0.06,
            delay: 1,
        })

        gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        })
            .to('.right-leaf', { y: 200 }, 0)
            .to('.left-leaf', { y: -200 }, 0)

        const startValue = isMobile ? 'top 50%' : 'center 60%'
        const endValue = isMobile ? '120% top' : 'bottom top'

        // Initialize video scrub animation
        if (videoRef.current) {
            const video = videoRef.current;

            const initVideoAnimation = () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: video,
                        start: startValue,
                        end: endValue,
                        scrub: true,
                        pin: true,
                    },
                });

                tl.to(video, {
                    currentTime: video.duration || 0,
                });
            };

            // Force load on iOS/WebKit
            video.load();

            // Multiple fallback listeners for iOS compatibility
            const setupAnimation = () => {
                if (video.duration && video.duration > 0) {
                    initVideoAnimation();
                }
            };

            // Check if metadata is already loaded
            if (video.readyState >= 1 && video.duration) {
                initVideoAnimation();
            } else {
                // Listen to multiple events for iOS compatibility
                video.addEventListener('loadedmetadata', setupAnimation, { once: true });
                video.addEventListener('loadeddata', setupAnimation, { once: true });
                video.addEventListener('canplay', setupAnimation, { once: true });

                // Fallback timeout for iOS
                setTimeout(setupAnimation, 1000);
            }
        }

    }, [isMobile])

    return (

        <>
            <section id='hero' className='noisy'>
                <h1 className='title'>SOMSA</h1>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-left-leaf.png"
                    alt="left-leaf"
                    className="left-leaf"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero-right-leaf.png"
                    alt="right-leaf"
                    className="right-leaf"
                />

                <div className="body">
                    <div className="content">
                        <div className="space-y-5 hidden md:block">
                            <p>Cool. Crisp. Classic</p>
                            <p className="subtitle">
                                Sip the Spirit <br /> of Summer
                            </p>
                        </div>

                        <div className="view-cocktails">
                            <p className="subtitle">Every cocktail we serve is a reflection of our obsession with detail — from the first muddle to the final garnish. That care is what turns a simple drink into something truly memorable. </p>
                            <a href="#cocktails">View Cocktails</a>
                        </div>

                    </div>
                </div>

            </section >

            <div className="video absolute inset-0">
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    preload="auto"
                    src="/videos/output.mp4"
                />
            </div>
        </>
    )
}

export default Hero