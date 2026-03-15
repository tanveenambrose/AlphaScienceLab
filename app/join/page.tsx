"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function JoinPage() {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", department: "", batch: "",
        semester: "", email: "", interest: "", skills: "", hours: "", reason: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!termsAccepted) return alert("Please accept the terms and conditions.");
        setStatus("loading");
        try {
            const res = await fetch("/api/join", {
                method: "POST", body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) setStatus("success");
            else setStatus("error");
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col pt-24">
            <Navbar />
            
            {/* Background Glows specific to Join page */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-[#3D1022]/40 rounded-full blur-[150px]" />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10 w-full mb-10">
                {status === "success" ? (
                    <div className="w-full max-w-xl mx-auto rounded-[40px] p-12 text-center bg-[#080309] border border-[#962E9B]/60 shadow-[0_0_80px_rgba(150,46,155,0.15)] flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                            <Check className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Request Submitted!</h2>
                        <p className="text-zinc-400 max-w-sm">We have received your application to join Alpha Science Lab. We will review it and get back to you soon.</p>
                        <button onClick={() => window.location.href = '/'} className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Return Home</button>
                    </div>
                ) : (
                    <div 
                        className="w-full max-w-xl mx-auto rounded-[40px] p-8 md:p-14 relative overflow-hidden"
                        style={{
                            background: "#080309",
                            border: "1px solid rgba(150, 46, 155, 0.6)",
                            boxShadow: "0 0 80px rgba(150, 46, 155, 0.15)"
                        }}
                    >
                        <h1 className="text-center font-tech text-xl md:text-2xl font-bold mb-10 tracking-[0.05em] text-white">
                            <span className="text-red-500 mr-1">*</span>Membership Form
                        </h1>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full font-tech">
                            <div className="w-full">
                                <input required type="text" placeholder="First name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm outline-none" />
                            </div>
                            <div className="w-full">
                                <input required type="text" placeholder="Last name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm outline-none" />
                            </div>

                            <div className="w-full relative">
                                <select required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer text-sm outline-none">
                                    <option value="" disabled className="bg-black text-white/50">Department</option>
                                    <option value="CSE" className="bg-black text-white">CSE</option>
                                    <option value="EEE" className="bg-black text-white">EEE</option>
                                    <option value="Civil" className="bg-black text-white">Civil</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                            </div>

                            <div className="w-full">
                                <input required type="text" placeholder="Batch (e.g. 2024)" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm outline-none" />
                            </div>

                            <div className="w-full relative">
                                <select required value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer text-sm outline-none">
                                    <option value="" disabled className="bg-black text-white/50">Semester</option>
                                    <option value="1" className="bg-black text-white">1st Semester</option>
                                    <option value="2" className="bg-black text-white">2nd Semester</option>
                                    <option value="3" className="bg-black text-white">3rd Semester</option>
                                    <option value="4" className="bg-black text-white">4th Semester</option>
                                    <option value="5" className="bg-black text-white">5th Semester</option>
                                    <option value="6" className="bg-black text-white">6th Semester</option>
                                    <option value="7" className="bg-black text-white">7th Semester</option>
                                    <option value="8" className="bg-black text-white">8th Semester</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                            </div>

                            <div className="w-full">
                                <input required type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm outline-none" />
                            </div>

                            <div className="w-full relative">
                                <select required value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer text-sm outline-none">
                                    <option value="" disabled className="bg-black text-white/50">Areas of interest</option>
                                    <option value="vlsi" className="bg-black text-white">VLSI and Semiconductor</option>
                                    <option value="robotics" className="bg-black text-white">Robotics & Automation</option>
                                    <option value="software" className="bg-black text-white">Software & Web</option>
                                    <option value="hardware" className="bg-black text-white">Hardware & PCB</option>
                                    <option value="design" className="bg-black text-white">2D/3D Design</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                            </div>

                            <div className="w-full">
                                <input required type="text" placeholder="Skills [eg. MS Office, Figma, Unity]" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm outline-none" />
                            </div>

                            <div className="w-full relative">
                                <select required value={formData.hours} onChange={(e) => setFormData({...formData, hours: e.target.value})} className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-[#7B177D] to-[#360938] text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer text-sm outline-none">
                                    <option value="" disabled className="bg-black text-white/50">Hours per week available?</option>
                                    <option value="1-3" className="bg-black text-white">1 - 3 hours</option>
                                    <option value="3-5" className="bg-black text-white">3 - 5 hours</option>
                                    <option value="5-10" className="bg-black text-white">5 - 10 hours</option>
                                    <option value="10+" className="bg-black text-white">10+ hours</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                            </div>

                            <div className="w-full mt-2">
                                <label className="block text-white/80 text-xs text-center mb-2 font-medium">Why do you want to join Alpha Science Lab?</label>
                                <textarea required rows={4} placeholder="within 100 words" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full rounded-[24px] px-6 py-4 bg-gradient-to-r from-[#7B177D]/80 to-[#360938]/80 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm resize-none text-center outline-none" />
                            </div>

                            <div className="w-full flex items-center justify-center gap-3 mt-4">
                                <label className="relative flex items-center cursor-pointer">
                                    <input type="checkbox" className="peer sr-only" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                                    <div className="w-4 h-4 rounded border border-[#962E9B]/50 bg-transparent flex items-center justify-center peer-checked:bg-primary transition-colors">
                                        <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                                    </div>
                                    <span className="ml-2 text-xs text-white/80">Terms and Conditions</span>
                                </label>
                            </div>

                            {status === "error" && <p className="text-red-400 text-sm text-center">Failed to submit. Please try again.</p>}

                            <div className="w-full flex justify-center mt-6 mb-2">
                                <button type="submit" disabled={status === "loading"} className="rounded-full px-10 py-3 bg-black border border-primary text-white text-sm font-semibold hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(150,46,155,0.4)] transition-all flex items-center justify-center cursor-pointer disabled:opacity-50">
                                    {status === "loading" ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
