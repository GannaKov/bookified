import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const steps = [
    {
        number: 1,
        title: 'Upload PDF',
        description: 'Add your book file',
    },
    {
        number: 2,
        title: 'AI Processing',
        description: 'We analyze the content',
    },
    {
        number: 3,
        title: 'Voice Chat',
        description: 'Discuss with AI',
    },
]

const HeroSection = () => {
    return (
        <section className=" mb-10 md:mb-16">
            <div className="library-hero-card">
                <div className="library-hero-content">
                    {/* Left — heading, description, CTA */}
                    <div className="library-hero-text">
                        <h1 className="library-hero-title">Your Library</h1>
                        <p className="library-hero-description">
                            Convert your books into interactive AI conversations.
                            Listen, learn, and discuss your favorite reads.
                        </p>

                        {/* Illustration — mobile only (between description and button) */}
                        <div className="library-hero-illustration">
                            <Image
                                src="/assets/hero-illustration.png"
                                alt="Books and globe illustration"
                                width={280}
                                height={200}
                                className="object-contain"
                                priority
                            />
                        </div>

                        <Link href="/books/new" className="library-cta-primary">
                            <span className="text-xl font-bold">+</span> Add new book
                        </Link>
                    </div>

                    {/* Center — illustration desktop */}
                    <div className="library-hero-illustration-desktop">
                        <Image
                            src="/assets/hero-illustration.png"
                            alt="Books and globe illustration"
                            width={420}
                            height={320}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>

                    {/* Right — steps card (desktop only) */}
                    <div className="library-steps-card hidden lg:flex flex-col gap-4 min-w-[220px] max-w-[240px] self-center shadow-soft-md">
                        {steps.map(({ number, title, description }, index) => (
                            <div key={number} className="flex flex-col gap-3">
                                <div className="library-step-item">
                                    <span className="library-step-number">{number}</span>
                                    <div>
                                        <p className="library-step-title">{title}</p>
                                        <p className="library-step-description">{description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="h-px w-full bg-[var(--border-subtle)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
