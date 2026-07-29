"use client";

import Image from "next/image";

export default function AboutContent() {
    return (
        <>
            {/* Hero */}
            <header className="relative pt-[120px] pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[614px] flex flex-col justify-center">
                <div className="absolute inset-0 z-[-1] overflow-hidden opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary-container rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
                </div>
                <div className="max-w-3xl z-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-surface-variant border border-primary/20 mb-stack-md">
                        <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">The Genesis</span>
                    </div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-stack-md">
                        Forging the Future at <br /><span className="text-secondary">MEC</span>
                    </h1>
                    <p className="font-body-lg text-on-surface-variant max-w-2xl">
                        Alpha Science Lab (ASL) is a premier research and development hub nested within Mymensingh Engineering College. We bridge the gap between theoretical knowledge and practical innovation, specializing in robotics, aerospace, and advanced computational systems.
                    </p>
                </div>
            </header>

            {/* Mission & Vision */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="glass-card rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-[40px] group-hover:bg-primary/20 transition-all duration-500" />
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                            <h2 className="font-headline-md text-primary">Mission</h2>
                        </div>
                        <p className="font-body-md text-on-surface-variant">
                            To cultivate a generation of frontier engineers by providing state-of-the-art infrastructure, rigorous mentorship, and a collaborative ecosystem that transforms bold ideas into tangible technological advancements for Bangladesh and beyond.
                        </p>
                    </div>
                    <div className="glass-card rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full filter blur-[40px] group-hover:bg-secondary/20 transition-all duration-500" />
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-4xl text-secondary">visibility</span>
                            <h2 className="font-headline-md text-secondary">Vision</h2>
                        </div>
                        <p className="font-body-md text-on-surface-variant">
                            To become the undisputed epicenter of autonomous systems and aerospace research in South Asia, pioneering solutions that redefine human-machine interaction and propel humanity towards a technologically equitable future.
                        </p>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
                <div className="text-center mb-stack-lg">
                    <h2 className="font-display-md text-primary mb-2">Our Journey</h2>
                    <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Milestones of Innovation</p>
                </div>
                <div className="relative max-w-4xl mx-auto py-12">
                    <div className="timeline-line" />
                    {/* Item 1 */}
                    <div className="relative flex justify-between items-center w-full mb-24 group">
                        <div className="w-5/12 pr-8 text-right">
                            <h3 className="font-headline-md text-primary mb-2">Inception</h3>
                            <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">2021</p>
                            <p className="font-body-md text-on-surface-variant">Founded by a visionary group of MEC students aiming to create a dedicated space for hands-on robotics research.</p>
                        </div>
                        <div className="timeline-dot group-hover:scale-150 transition-transform duration-300" />
                        <div className="w-5/12 pl-8">
                            <div className="glass-card rounded-lg overflow-hidden h-40 relative group-hover:border-secondary/50 transition-colors">
                                <Image
                                    className="object-cover w-full h-full opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                                    alt="Inception"
                                    fill
                                    unoptimized
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzGf6h40H1o1il78-fUD0N7coZVvOxzdE9BgInFGHOEPl8ox2g59_yQQ0NWNAHvGbCH9yGZ5_qq2SOF0Mi6BPWl3sbX1TUseFLB6ydKvNHZiaQgQ5Xl86oGaE3QlhoSC6SEPQoLfR7SNzjWfdfgfal6VXGFC3rpheQwMyCdYTqrnLLIoYLB8O82IU3rdM16PRtOzDCFpjDnfSijxKCAlA12NzRnmSnkO-CTztX8dOjHDv-dfyzJrte-zqYDnug8V2HB_wC3PTPb1s"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="relative flex justify-between items-center w-full mb-24 flex-row-reverse group">
                        <div className="w-5/12 pl-8 text-left">
                            <h3 className="font-headline-md text-primary mb-2">First Flight</h3>
                            <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">2022</p>
                            <p className="font-body-md text-on-surface-variant">Successful deployment of ASL&apos;s first autonomous UAV drone, marking our entry into aerospace engineering domains.</p>
                        </div>
                        <div className="timeline-dot group-hover:scale-150 transition-transform duration-300" />
                        <div className="w-5/12 pr-8">
                            <div className="glass-card rounded-lg overflow-hidden h-40 relative group-hover:border-secondary/50 transition-colors">
                                <Image
                                    className="object-cover w-full h-full opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                                    alt="First Flight"
                                    fill
                                    unoptimized
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfPZcDwNsouyfMbk0Gl69v6bj_Nym0WL_gtGyELqVqrcrFNlYJMRmKhBfyaTsIwihOqfppmTfW-SUidkfU-B9BdI4aJdiH9cjxE2sS6mGO36flGHS_0u9-NKPc3zGxxhE18APJ1WcrrlP7UrmENczcnTf-7HMXtrAEPdchV2yWojNGuSi6s-i5XenKkvQtztHxZGUhdIOH56jss4Sl8O8yvZDBmDb4_FGGHRcyCWKd1za7geOGCpTiCATC8-bJrU_of47m4GjrFS4"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="relative flex justify-between items-center w-full group">
                        <div className="w-5/12 pr-8 text-right">
                            <h3 className="font-headline-md text-primary mb-2">Uro Partnership</h3>
                            <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">2024</p>
                            <p className="font-body-md text-on-surface-variant">Secured strategic collaboration with Uro Bangladesh, vastly expanding computational resources and hardware accessibility.</p>
                        </div>
                        <div className="timeline-dot group-hover:scale-150 transition-transform duration-300" />
                        <div className="w-5/12 pl-8">
                            <div className="glass-card rounded-lg overflow-hidden h-40 relative group-hover:border-secondary/50 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-surface-variant">handshake</span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-primary/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnerships */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10 border-t border-outline-variant/20">
                <div className="text-center mb-stack-lg">
                    <h2 className="font-display-md text-primary mb-2">Strategic Alliances</h2>
                    <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Powering Our Research</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-12">
                    <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center w-48 h-32 hover:border-secondary transition-colors group cursor-pointer">
                        <span className="font-display-md text-on-surface-variant group-hover:text-secondary transition-colors uppercase tracking-tighter">URO</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant mt-1">Bangladesh</span>
                    </div>
                    <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center w-48 h-32 hover:border-primary transition-colors group cursor-pointer opacity-50">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-2">business</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">Future Partner</span>
                    </div>
                </div>
            </section>

            {/* Join CTA */}
            <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10 mb-24">
                <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <h2 className="font-display-md text-white mb-4">Ready to Build the Future?</h2>
                    <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
                        We are constantly looking for brilliant minds in engineering, computer science, and applied physics. Join ASL and gain access to cutting-edge tech and elite mentorship.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => window.location.href = '/join'}
                            className="bg-gradient-to-r from-primary-container to-tertiary-container text-white font-label-sm text-label-sm uppercase tracking-widest px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(221,183,255,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-xl">terminal</span>
                            Apply Now
                        </button>
                        <button className="bg-transparent border border-secondary text-secondary font-label-sm text-label-sm uppercase tracking-widest px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(76,215,246,0.3)] transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-xl">description</span>
                            View Requirements
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
