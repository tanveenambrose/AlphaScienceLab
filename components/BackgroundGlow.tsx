"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Purple/Pink Glow Blob */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: [0.3, 0.45, 0.3],
                    x: [0, 40, -40, 0],
                    y: [0, -30, 30, 0],
                    scale: [1, 1.05, 0.95, 1]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-15%] right-[10%] w-[700px] h-[500px] rounded-full will-change-transform"
                style={{
                    background: "linear-gradient(135deg, #CB70FF 0%, #E2AEFF 100%)",
                    filter: "blur(120px)",
                    rotate: "-18.5deg"
                }}
            />

            {/* Teal/Blue Glow Blob */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: [0.2, 0.35, 0.2],
                    x: [0, -50, 50, 0],
                    y: [0, 40, -40, 0],
                    scale: [1, 0.95, 1.05, 1]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-[-15%] left-[5%] w-[800px] h-[600px] rounded-full will-change-transform"
                style={{
                    background: "linear-gradient(135deg, #35467F 0%, #1030c0 100%)",
                    filter: "blur(120px)",
                    rotate: "-15deg"
                }}
            />

            {/* Indigo Accent */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: [0.15, 0.25, 0.15],
                    x: [0, 30, -30, 0],
                    y: [0, 20, -20, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] left-[20%] w-[500px] h-[350px] rounded-full will-change-transform"
                style={{
                    background: "radial-gradient(circle, #7B61FF 0%, transparent 70%)",
                    filter: "blur(100px)",
                }}
            />
        </div>
    );
}
