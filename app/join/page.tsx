"use client";

import { useState, useRef } from "react";
import {
    UploadCloud, Check, AlertCircle, ChevronRight, ChevronLeft,
    ShieldCheck, Star, ArrowRight, Users, Gavel
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─────────────────────────────────────────── */
/*  Types                                       */
/* ─────────────────────────────────────────── */
interface FormData {
    email: string;
    fullName: string;
    department: string;
    batch: string;
    classRoll: string;
    registration: string;
    mobile: string;
}

/* ─────────────────────────────────────────── */
/*  Sub-components                              */
/* ─────────────────────────────────────────── */

const SectionTag = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#EC0D6E] bg-[#EC0D6E]/10 border border-[#EC0D6E]/30 px-3 py-1 rounded-full mb-3">
        {children}
    </span>
);

const StepDot = ({ n, step }: { n: number, step: number }) => (
    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
        n < step  ? "bg-[#EC0D6E]" :
        n === step ? "bg-[#EC0D6E] ring-2 ring-[#EC0D6E]/40 scale-125" :
                     "bg-white/10"
    }`} />
);

const Field = ({
    label, field, type = "text", placeholder = "Your answer", value, error, onChange
}: { label: string; field: string; type?: string; placeholder?: string; value: string; error?: string; onChange: (val: string) => void }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
            {label} <span className="text-[#EC0D6E]">*</span>
        </label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-full bg-transparent border-b ${
                error ? "border-red-500" : "border-white/20"
            } focus:border-[#EC0D6E] outline-none text-white text-sm py-2 transition-colors placeholder-white/25`}
        />
        {error && (
            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

const RadioGroup = ({
    label, field, options, value, error, onChange
}: { label: string; field: string; options: string[]; value: string; error?: string; onChange: (val: string) => void }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
            {label} <span className="text-[#EC0D6E]">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                        value === opt
                            ? "bg-[#EC0D6E] border-[#EC0D6E] text-white shadow-[0_0_15px_rgba(236,13,110,0.4)]"
                            : "border-white/20 text-zinc-300 hover:border-[#EC0D6E]/50 hover:text-white bg-white/5"
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
        {error && (
            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

/* ─────────────────────────────────────────── */
/*  Page                                        */
/* ─────────────────────────────────────────── */
export default function JoinPage() {
    const [step, setStep] = useState(1);
    const TOTAL_STEPS = 4;

    const [formData, setFormData] = useState<FormData>({
        email: "", fullName: "", department: "", batch: "",
        classRoll: "", registration: "", mobile: "",
    });
    const [photo, setPhoto]           = useState<File | null>(null);
    const [status, setStatus]         = useState<"idle" | "loading" | "success" | "error">("idle");
    const [termsAccepted, setTerms]   = useState(false);
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const fileInputRef                = useRef<HTMLInputElement>(null);

    /* ── Helpers ─────────────────────────────── */
    const set = (field: keyof FormData, val: string) => {
        setFormData(p => ({ ...p, [field]: val }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: "" }));
    };

    const validateStep = (): boolean => {
        const e: Record<string, string> = {};
        if (step === 1) {
            if (!termsAccepted) e.terms = "You must accept the terms to continue.";
        }
        if (step === 2) {
            if (!formData.fullName.trim()) e.fullName = "Full Name is required";
            if (!formData.email.trim()) {
                e.email = "Email address is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                e.email = "Must be a valid email address";
            }
            if (!formData.mobile.trim()) {
                e.mobile = "Mobile number is required";
            } else if (!/^\d{11}$/.test(formData.mobile)) {
                e.mobile = "Must be exactly 11 digits (e.g. 01XXXXXXXXX)";
            }
        }
        if (step === 3) {
            if (!formData.department) e.department = "Please select a department";
            if (!formData.batch)      e.batch      = "Please select a batch";
            if (!formData.classRoll.trim()) {
                e.classRoll = "Class Roll is required";
            } else if (!/^\d+$/.test(formData.classRoll)) {
                e.classRoll = "Numbers only";
            }
            if (!formData.registration.trim()) {
                e.registration = "Registration No. is required";
            } else if (!/^\d+$/.test(formData.registration)) {
                e.registration = "Numbers only";
            }
        }
        if (step === 4) {
            if (!photo) e.photo = "Please upload your photo";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) { setStep(s => s + 1); window.scrollTo(0, 0); }
    };
    const handleBack = () => { setStep(s => s - 1); window.scrollTo(0, 0); };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setStatus("loading");
        try {
            const fd = new FormData();
            (Object.entries(formData) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
            if (photo) fd.append("photo", photo);
            const res = await fetch("/api/join", { method: "POST", body: fd });
            setStatus(res.ok ? "success" : "error");
        } catch {
            setStatus("error");
        }
    };



    /* ── Success screen ──────────────────────── */
    if (status === "success") {
        return (
            <main className="min-h-screen bg-[#080309] text-white relative overflow-hidden flex flex-col">
                <Navbar />
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#962E9B]/20 rounded-full blur-[160px]" />
                </div>
                <div className="flex-1 flex items-center justify-center px-4 py-40">
                    <div className="max-w-md text-center space-y-6">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                            <Check className="text-green-400 w-9 h-9" />
                        </div>
                        <h1 className="font-display text-4xl font-bold">Application Submitted!</h1>
                        <p className="text-zinc-400 leading-relaxed">
                            Your membership application has been received. The admin team will review it and notify you once approved.
                        </p>
                        <a href="/" className="inline-block mt-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all">
                            Return Home
                        </a>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    /* ── Main render ─────────────────────────── */
    return (
        <main className="min-h-screen bg-[#080309] text-white relative overflow-hidden flex flex-col font-inter">
            <Navbar />

            {/* Background ambient glows */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[10%] -right-[5%] w-[700px] h-[700px] bg-[#962E9B]/15 rounded-full blur-[180px]" />
                <div className="absolute bottom-[10%] -left-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
                <div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] bg-[#EC0D6E]/10 rounded-full blur-[120px]" />
            </div>

            <div className="flex-1 flex flex-col px-4 pt-[140px] pb-16 relative z-10 w-full max-w-[1259px] mx-auto">

                {/* ── Page header ──────────────────────── */}
                <div className="mb-12 space-y-4">
                    <SectionTag><Users size={11} /> Membership Recruitment</SectionTag>
                    <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-none">
                        Join Alpha<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC0D6E] to-[#962E9B]">Science Lab</span>
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
                        Become part of a community driven by innovation, scientific curiosity, and collaborative research. Fill out the application below to apply.
                    </p>
                </div>

                {/* ── Divider ──────────────────────────── */}
                <div className="w-full h-px border-b border-[#962E9B]/40 mb-12" />

                {/* ── Two-column layout ────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Rules panels (always visible) */}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

                        {/* Member Rules card */}
                        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.07] p-6 backdrop-blur-sm space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="text-blue-400" size={18} />
                                <h3 className="font-bold text-white text-sm uppercase tracking-widest">General Member Rules</h3>
                            </div>
                            {[
                                ["Commitment", "Active involvement required. Complete tasks honestly within deadlines."],
                                ["Attendance", "Warning at <50%. Termination below 20% attendance."],
                                ["Fees", "Non-refundable BDT 300 one-time + BDT 50 monthly."],
                                ["Confidentiality", "All lab projects and discussions are strictly confidential."],
                                ["Resources", "No equipment for personal use. Report damage immediately."],
                                ["Conduct", "Zero tolerance for discrimination or unprofessional behaviour."],
                            ].map(([title, desc]) => (
                                <div key={title} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold text-xs">{title}: </span>
                                        <span className="text-zinc-400 text-xs">{desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Executive Roles card */}
                        <div className="rounded-3xl bg-gradient-to-br from-[#EC0D6E]/10 to-transparent border border-[#EC0D6E]/20 p-6 backdrop-blur-sm space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="text-[#EC0D6E]" size={18} />
                                <h3 className="font-bold text-white text-sm uppercase tracking-widest">Executive Member Roles</h3>
                            </div>
                            {[
                                ["Leadership", "Assist Wing Head in planning and supervise General Members."],
                                ["Accountability", "Ensure tasks are completed on time. Maintain activity records."],
                                ["Communication", "Bridge between Wing Head and General Members."],
                            ].map(([title, desc]) => (
                                <div key={title} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#EC0D6E] mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold text-xs">{title}: </span>
                                        <span className="text-zinc-400 text-xs">{desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </aside>

                    {/* Right: Multi-step form */}
                    <div className="lg:col-span-8">

                        {/* Step progress bar */}
                        <div className="flex items-center gap-3 mb-8">
                            {Array.from({ length: TOTAL_STEPS }, (_, i) => <StepDot key={i} n={i + 1} step={step} />)}
                            <span className="ml-2 text-xs text-zinc-500 font-bold uppercase tracking-widest">Step {step} of {TOTAL_STEPS}</span>
                        </div>

                        {/* Form card */}
                        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.07] p-8 md:p-10 backdrop-blur-sm space-y-8">

                            {/* ── STEP 1: Terms ───────────────────── */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <SectionTag><Gavel size={11} /> Terms & Conditions</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Read Before You Apply</h2>
                                        <p className="text-zinc-400 text-sm mt-1">By joining ASL, you agree to uphold the values and responsibilities of the lab.</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-zinc-300 space-y-3 max-h-60 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                                        <p>Alpha Science Lab is a dedicated student research community. By submitting this form, you agree to:</p>
                                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                                            <li>Maintain active participation and complete assigned tasks within deadlines.</li>
                                            <li>Maintain attendance above 50%; falling below 20% will result in termination of membership.</li>
                                            <li>Pay a one-time non-refundable registration fee of BDT 300 and a monthly fee of BDT 50.</li>
                                            <li>Keep all lab projects, designs, methodologies, and discussions strictly confidential.</li>
                                            <li>Use lab equipment responsibly and report any damage immediately.</li>
                                            <li>Maintain respectful, professional conduct at all times. Zero tolerance for discrimination.</li>
                                            <li>Executive Members additionally must coordinate with the Wing Head and maintain records of all activities.</li>
                                        </ul>
                                        <p className="font-semibold text-white">Failure to abide by these rules may result in immediate termination of membership without refund of fees.</p>
                                    </div>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div
                                            onClick={() => { setTerms(p => !p); if (errors.terms) setErrors(p => ({ ...p, terms: "" })); }}
                                            className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                                termsAccepted ? "bg-[#EC0D6E] border-[#EC0D6E]" : "border-white/30 group-hover:border-[#EC0D6E]/50"
                                            }`}
                                        >
                                            {termsAccepted && <Check size={13} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm text-zinc-300 leading-relaxed">
                                            I have read and understood the Rules & Regulations of Alpha Science Lab, and I agree to abide by all the policies. <span className="text-[#EC0D6E]">*</span>
                                        </span>
                                    </label>
                                    {errors.terms && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.terms}</p>}
                                </div>
                            )}

                            {/* ── STEP 2: Personal Info ───────────── */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <SectionTag><Users size={11} /> Personal Information</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Tell Us About Yourself</h2>
                                        <p className="text-zinc-400 text-sm mt-1">* Indicates required question</p>
                                    </div>
                                    <Field label="Full Name" field="fullName" placeholder="e.g. Tanveen Ambrose" value={formData.fullName} error={errors.fullName} onChange={val => set("fullName", val)} />
                                    <Field label="Email Address" field="email" type="email" placeholder="example@gmail.com" value={formData.email} error={errors.email} onChange={val => set("email", val)} />
                                    <Field label="Mobile Number" field="mobile" type="tel" placeholder="01XXXXXXXXX (11 digits)" value={formData.mobile} error={errors.mobile} onChange={val => set("mobile", val)} />
                                </div>
                            )}

                            {/* ── STEP 3: Academic Details ─────────── */}
                            {step === 3 && (
                                <div className="space-y-7">
                                    <div>
                                        <SectionTag>Academic Details</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Your Academic Info</h2>
                                    </div>
                                    <RadioGroup label="Department" field="department" options={["CSE", "EEE", "CE"]} value={formData.department} error={errors.department} onChange={val => set("department", val)} />
                                    <RadioGroup label="Batch" field="batch" options={["14th", "15th", "16th"]} value={formData.batch} error={errors.batch} onChange={val => set("batch", val)} />
                                    <div className="grid grid-cols-2 gap-6">
                                        <Field label="Class Roll" field="classRoll" placeholder="e.g. 210310" value={formData.classRoll} error={errors.classRoll} onChange={val => set("classRoll", val)} />
                                        <Field label="Registration No." field="registration" placeholder="e.g. 1301" value={formData.registration} error={errors.registration} onChange={val => set("registration", val)} />
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 4: Photo Upload ─────────────── */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <SectionTag><UploadCloud size={11} /> Final Step</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Upload Your Photo</h2>
                                        <p className="text-zinc-400 text-sm mt-1">Upload 1 supported file. Max 10 MB. (JPG, PNG, WEBP)</p>
                                    </div>

                                    {!photo ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-white/20 hover:border-[#EC0D6E]/50 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04] group"
                                        >
                                            <input type="file" ref={fileInputRef} onChange={e => { if (e.target.files?.[0]) { setPhoto(e.target.files[0]); if (errors.photo) setErrors(p => ({...p, photo: ""})); } }} accept="image/*" className="hidden" />
                                            <UploadCloud className="w-10 h-10 text-zinc-500 group-hover:text-[#EC0D6E] transition-colors mb-3" />
                                            <p className="text-zinc-300 font-semibold text-sm">Click to upload photo</p>
                                            <p className="text-zinc-500 text-xs mt-1">or drag and drop</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-2xl bg-white/5">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-xl bg-[#EC0D6E]/20 border border-[#EC0D6E]/30 flex items-center justify-center shrink-0">
                                                    <Check className="text-[#EC0D6E] w-5 h-5" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-white text-sm font-semibold truncate">{photo.name}</p>
                                                    <p className="text-zinc-500 text-xs">{(photo.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setPhoto(null)} className="text-zinc-500 hover:text-red-400 text-xl px-2 transition-colors">×</button>
                                        </div>
                                    )}
                                    {errors.photo && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.photo}</p>}
                                    {status === "error" && (
                                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                            <AlertCircle size={16} /> Failed to submit. Please check your info and try again.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Navigation Buttons ───────────────── */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div>
                                    {step > 1 && (
                                        <button onClick={handleBack} className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 text-sm font-bold uppercase tracking-widest transition-all">
                                            <ChevronLeft size={16} /> Back
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setFormData({ email: "", fullName: "", department: "", batch: "", classRoll: "", registration: "", mobile: "" });
                                            setPhoto(null); setStep(1); setTerms(false); setErrors({});
                                        }}
                                        className="text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-widest transition-colors"
                                    >
                                        Clear
                                    </button>
                                    {step < TOTAL_STEPS ? (
                                        <button onClick={handleNext} className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(236,13,110,0.5)] transition-all">
                                            Next <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button onClick={handleSubmit} disabled={status === "loading"} className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(236,13,110,0.5)] transition-all disabled:opacity-50">
                                            {status === "loading" ? "Submitting…" : <><ArrowRight size={16} /> Submit</>}
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                        {/* Form note */}
                        <p className="text-center text-zinc-600 text-xs mt-4">
                            The name, email address and photo you provide will be recorded as part of your application.
                        </p>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
