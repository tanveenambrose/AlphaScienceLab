"use client";

import { useState, useRef } from "react";
import {
    UploadCloud, Check, AlertCircle, ChevronRight, ChevronLeft,
    ShieldCheck, Star, ArrowRight, Users, Gavel, BookOpen, Clock,
    DollarSign, Lock, AlertTriangle, HeartHandshake, Award
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
            className={`w-full bg-white/[0.02] border ${
                error ? "border-red-500/80 bg-red-500/5" : "border-white/10 hover:border-white/20"
            } focus:border-[#EC0D6E] rounded-xl px-4 py-3 outline-none text-white text-sm transition-all placeholder-white/25`}
        />
        {error && (
            <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

const RadioGroup = ({
    label, options, value, error, onChange
}: { label: string; options: string[]; value: string; error?: string; onChange: (val: string) => void }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
            {label} <span className="text-[#EC0D6E]">*</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
            {options.map(opt => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        value === opt
                            ? "bg-[#EC0D6E] border-[#EC0D6E] text-white shadow-[0_0_15px_rgba(236,13,110,0.4)] scale-105"
                            : "border-white/10 text-zinc-300 hover:border-[#EC0D6E]/50 hover:text-white bg-white/5"
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
        {error && (
            <p className="text-red-400 text-[11px] mt-2 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
            </p>
        )}
    </div>
);

/* ─────────────────────────────────────────── */
/*  Main Page Component                         */
/* ─────────────────────────────────────────── */
export default function JoinPage() {
    const [step, setStep] = useState(1);
    const TOTAL_STEPS = 4;

    const [formData, setFormData] = useState<FormData>({
        email: "", fullName: "", department: "", batch: "",
        classRoll: "", registration: "", mobile: "",
    });
    const [photo, setPhoto]           = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [status, setStatus]         = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [termsAccepted, setTerms]   = useState(false);
    const [errors, setErrors]         = useState<Record<string, string>>({});
    const fileInputRef                = useRef<HTMLInputElement>(null);

    /* ── Helpers ─────────────────────────────── */
    const set = (field: keyof FormData, val: string) => {
        setFormData(p => ({ ...p, [field]: val }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: "" }));
    };

    const handlePhotoSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setErrors(p => ({ ...p, photo: "Please upload an image file (JPG, PNG, WEBP)" }));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setErrors(p => ({ ...p, photo: "Image size must be less than 10MB" }));
            return;
        }
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        if (errors.photo) setErrors(p => ({ ...p, photo: "" }));
    };

    const validateStep = (): boolean => {
        const e: Record<string, string> = {};
        if (step === 1) {
            if (!termsAccepted) e.terms = "You must acknowledge and accept the rules to continue.";
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
            if (!formData.department) e.department = "Please select your department";
            if (!formData.batch)      e.batch      = "Please select your batch";
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
            if (!photo) e.photo = "Please upload your applicant photo";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(s => s + 1);
            window.scrollTo({ top: 120, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        setStep(s => s - 1);
        window.scrollTo({ top: 120, behavior: "smooth" });
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setStatus("loading");
        setErrorMessage("");

        try {
            const fd = new FormData();
            (Object.entries(formData) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
            if (photo) fd.append("photo", photo);

            const res = await fetch("/api/join", { method: "POST", body: fd });
            const data = await res.json().catch(() => ({}));

            if (res.ok && data.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Failed to submit application. Please try again.");
            }
        } catch {
            setStatus("error");
            setErrorMessage("Network error occurred. Please check your connection and try again.");
        }
    };

    /* ── Success screen ──────────────────────── */
    if (status === "success") {
        return (
            <main className="min-h-screen bg-[#080309] text-white relative overflow-hidden flex flex-col font-inter">
                <Navbar />
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#962E9B]/20 rounded-full blur-[160px]" />
                </div>
                <div className="flex-1 flex items-center justify-center px-4 py-40">
                    <div className="max-w-lg text-center space-y-6 bg-white/[0.03] border border-white/10 rounded-3xl p-10 backdrop-blur-md">
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <Check className="text-emerald-400 w-10 h-10" strokeWidth={3} />
                        </div>
                        <SectionTag>Submission Successful</SectionTag>
                        <h1 className="font-display text-3xl md:text-4xl font-bold">Application Received!</h1>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            Thank you, <strong className="text-white">{formData.fullName}</strong>. Your membership application to <strong>Alpha Science Lab</strong> has been forwarded to the Executive Committee for review.
                        </p>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2 text-zinc-400">
                            <p className="text-white font-semibold flex items-center gap-2">
                                <Clock size={14} className="text-[#EC0D6E]" /> What happens next?
                            </p>
                            <p>1. The admin committee will review your academic and contact details.</p>
                            <p>2. Once approved, you will receive an automated email at <strong className="text-white">{formData.email}</strong> with your login credentials to access the ASL Member Portal.</p>
                        </div>
                        <a href="/" className="inline-block mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(236,13,110,0.4)] transition-all">
                            Return to Homepage
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

            <div className="flex-1 flex flex-col px-4 pt-[130px] pb-16 relative z-10 w-full max-w-[1259px] mx-auto">

                {/* ── Page header ──────────────────────── */}
                <div className="mb-10 space-y-3">
                    <SectionTag><Users size={11} /> Official Recruitment</SectionTag>
                    <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        Join Alpha <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC0D6E] to-[#962E9B]">Science Lab</span>
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
                        Alpha Science Lab (ASL) is opening its recruitment as part of its officialization process. We are looking for passionate, motivated students eager to innovate, learn, and collaborate.
                    </p>
                </div>

                {/* ── Divider ──────────────────────────── */}
                <div className="w-full h-px border-b border-[#962E9B]/30 mb-10" />

                {/* ── Two-column layout ────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Left: Rules & Responsibilities Panels */}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

                        {/* General Member Rules card */}
                        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 backdrop-blur-md space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="text-blue-400" size={20} />
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Member Rules Summary</h3>
                            </div>
                            <div className="space-y-3 text-xs leading-relaxed">
                                <div className="flex gap-2.5 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold">1. Commitment: </span>
                                        <span className="text-zinc-400">Actively complete assigned tasks within specified deadlines.</span>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold">2. Attendance: </span>
                                        <span className="text-zinc-400">Weekly wing meetings. Warnings at &lt;50%, termination below 20%.</span>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold">3. Fees: </span>
                                        <span className="text-zinc-400">BDT 300 one-time registration + BDT 50 monthly subscription.</span>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold">4. Confidentiality: </span>
                                        <span className="text-zinc-400">All lab projects, code, and discussions are strictly confidential.</span>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div>
                                        <span className="text-white font-semibold">5. Conduct & Equipment: </span>
                                        <span className="text-zinc-400">Professional demeanor. No lab equipment for personal usage.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Executive Info Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-[#EC0D6E]/10 to-[#962E9B]/10 border border-[#EC0D6E]/20 p-6 backdrop-blur-md space-y-3">
                            <div className="flex items-center gap-2">
                                <Star className="text-[#EC0D6E]" size={18} />
                                <h3 className="font-bold text-white text-xs uppercase tracking-wider">Official Contact</h3>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                For inquiries regarding recruitment or executive wings, contact:
                            </p>
                            <div className="text-xs font-mono text-[#EC0D6E] bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                                alphasciencelabmecbd@gmail.com
                            </div>
                        </div>

                    </aside>

                    {/* Right: Multi-step form */}
                    <div className="lg:col-span-8">

                        {/* Step progress bar */}
                        <div className="flex items-center justify-between mb-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6 py-3.5 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                {Array.from({ length: TOTAL_STEPS }, (_, i) => <StepDot key={i} n={i + 1} step={step} />)}
                            </div>
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                Step {step} of {TOTAL_STEPS}: {
                                    step === 1 ? "Rules & Consent" :
                                    step === 2 ? "Personal Info" :
                                    step === 3 ? "Academic Info" : "Photo Upload"
                                }
                            </span>
                        </div>

                        {/* Form card */}
                        <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 md:p-10 backdrop-blur-md space-y-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">

                            {/* ── STEP 1: Terms ───────────────────── */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <SectionTag><Gavel size={11} /> Terms & Regulations</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Rules & Code of Conduct</h2>
                                        <p className="text-zinc-400 text-sm mt-1">Please read and acknowledge the official regulations before continuing.</p>
                                    </div>

                                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-zinc-300 space-y-3.5 max-h-72 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                                        <div className="font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                                            <BookOpen size={16} className="text-[#EC0D6E]" />
                                            Rules & Regulations for All Members:
                                        </div>
                                        <ol className="list-decimal list-inside space-y-2.5 text-zinc-400 text-xs">
                                            <li><strong className="text-zinc-200">Membership & Commitment:</strong> Members are expected to remain actively involved and complete assigned tasks honestly within deadlines.</li>
                                            <li><strong className="text-zinc-200">Attendance & Meetings:</strong> ASL conducts weekly wing meetings and collective lab meetings. Monthly attendance below 50% triggers a warning; below 20% leads to termination.</li>
                                            <li><strong className="text-zinc-200">Fees:</strong> All members pay a non-refundable BDT 300 one-time membership fee and BDT 50 monthly cost to maintain lab operations.</li>
                                            <li><strong className="text-zinc-200">Discipline & Conduct:</strong> Professional, respectful, and ethical conduct is required at all times. Zero tolerance for harassment or discrimination.</li>
                                            <li><strong className="text-zinc-200">Secrecy & Confidentiality:</strong> All lab research, designs, projects, code, and discussions are strictly confidential. Leakage results in immediate termination.</li>
                                            <li><strong className="text-zinc-200">Promotion:</strong> Promotions are based on performance, loyalty, leadership, and contribution.</li>
                                            <li><strong className="text-zinc-200">Lab Resources:</strong> Equipment must be used responsibly. Personal usage is strictly prohibited.</li>
                                            <li><strong className="text-zinc-200">Authority:</strong> The ASL Executive Committee & President hold supreme authority over appointments and amendments.</li>
                                        </ol>
                                    </div>

                                    <label className="flex items-start gap-3.5 cursor-pointer group p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#EC0D6E]/30 transition-all">
                                        <div
                                            onClick={() => { setTerms(p => !p); if (errors.terms) setErrors(p => ({ ...p, terms: "" })); }}
                                            className={`w-5 h-5 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                                                termsAccepted ? "bg-[#EC0D6E] border-[#EC0D6E]" : "border-white/30 group-hover:border-[#EC0D6E]/50"
                                            }`}
                                        >
                                            {termsAccepted && <Check size={13} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className="text-xs text-zinc-300 leading-relaxed select-none">
                                            I acknowledge that I have read and understood the <strong className="text-white">Rules & Regulations, Code of Conduct, and Confidentiality Policy</strong> of Alpha Science Lab. I agree to follow all rules and protect confidential information. <span className="text-[#EC0D6E]">*</span>
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
                                        <p className="text-zinc-400 text-xs mt-1">* All fields are mandatory</p>
                                    </div>
                                    <Field label="Full Name" field="fullName" placeholder="e.g. Tanveen Ambrose" value={formData.fullName} error={errors.fullName} onChange={val => set("fullName", val)} />
                                    <Field label="Email Address" field="email" type="email" placeholder="e.g. yourname@gmail.com" value={formData.email} error={errors.email} onChange={val => set("email", val)} />
                                    <Field label="Mobile Number" field="mobile" type="tel" placeholder="e.g. 01XXXXXXXXX (11 digits)" value={formData.mobile} error={errors.mobile} onChange={val => set("mobile", val)} />
                                </div>
                            )}

                            {/* ── STEP 3: Academic Details ─────────── */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <SectionTag>Academic Credentials</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Academic Information</h2>
                                        <p className="text-zinc-400 text-xs mt-1">Select your department and batch</p>
                                    </div>
                                    <RadioGroup label="Department" options={["CSE", "EEE", "CE", "Other"]} value={formData.department} error={errors.department} onChange={val => set("department", val)} />
                                    <RadioGroup label="Batch" options={["14th", "15th", "16th", "17th", "Other"]} value={formData.batch} error={errors.batch} onChange={val => set("batch", val)} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Class Roll" field="classRoll" placeholder="e.g. 210310" value={formData.classRoll} error={errors.classRoll} onChange={val => set("classRoll", val)} />
                                        <Field label="Registration No." field="registration" placeholder="e.g. 1301" value={formData.registration} error={errors.registration} onChange={val => set("registration", val)} />
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 4: Photo Upload ─────────────── */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <SectionTag><UploadCloud size={11} /> Verification</SectionTag>
                                        <h2 className="font-display text-2xl font-bold text-white mt-1">Applicant Photo</h2>
                                        <p className="text-zinc-400 text-xs mt-1">Upload a clear portrait photo (JPG, PNG, WEBP. Max 10MB)</p>
                                    </div>

                                    {!photo ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-white/20 hover:border-[#EC0D6E]/50 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={e => { if (e.target.files?.[0]) handlePhotoSelect(e.target.files[0]); }}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-[#EC0D6E]/10 border border-white/10 group-hover:border-[#EC0D6E]/30 flex items-center justify-center transition-all mb-4">
                                                <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-[#EC0D6E] transition-colors" />
                                            </div>
                                            <p className="text-white font-semibold text-sm">Click to choose image or drag & drop</p>
                                            <p className="text-zinc-500 text-xs mt-1">Supported formats: JPG, PNG, WEBP (Up to 10MB)</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-2xl bg-white/5">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-[#EC0D6E]/40 shrink-0" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-xl bg-[#EC0D6E]/20 flex items-center justify-center shrink-0">
                                                        <Check className="text-[#EC0D6E] w-6 h-6" />
                                                    </div>
                                                )}
                                                <div className="overflow-hidden">
                                                    <p className="text-white text-sm font-semibold truncate">{photo.name}</p>
                                                    <p className="text-zinc-400 text-xs">{(photo.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                                                className="text-zinc-400 hover:text-red-400 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    {errors.photo && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.photo}</p>}

                                    {/* Application Summary Box */}
                                    <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-zinc-400">
                                        <p className="text-white font-semibold uppercase tracking-wider text-[11px]">Application Preview:</p>
                                        <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                            <p><span className="text-zinc-500">Name:</span> {formData.fullName}</p>
                                            <p><span className="text-zinc-500">Email:</span> {formData.email}</p>
                                            <p><span className="text-zinc-500">Dept:</span> {formData.department} ({formData.batch})</p>
                                            <p><span className="text-zinc-500">Roll:</span> {formData.classRoll} (Reg: {formData.registration})</p>
                                        </div>
                                    </div>

                                    {status === "error" && (
                                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>{errorMessage || "Failed to submit application. Please check your data."}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Navigation Buttons ───────────────── */}
                            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                <div>
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            <ChevronLeft size={16} /> Back
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ email: "", fullName: "", department: "", batch: "", classRoll: "", registration: "", mobile: "" });
                                            setPhoto(null);
                                            setPhotoPreview(null);
                                            setStep(1);
                                            setTerms(false);
                                            setErrors({});
                                        }}
                                        className="text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-widest transition-colors px-3 py-2"
                                    >
                                        Clear Form
                                    </button>
                                    {step < TOTAL_STEPS ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(236,13,110,0.5)] transition-all"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={status === "loading"}
                                            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#EC0D6E] to-[#962E9B] text-white text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_25px_rgba(236,13,110,0.6)] transition-all disabled:opacity-50"
                                        >
                                            {status === "loading" ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Submitting…
                                                </span>
                                            ) : (
                                                <>
                                                    Submit Application <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Form footer notice */}
                        <p className="text-center text-zinc-500 text-xs mt-4">
                            Your submitted information will be reviewed securely by the ASL Executive Committee.
                        </p>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
