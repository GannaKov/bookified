"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadSchema } from "@/lib/zod";
import { Upload, ImageIcon, X } from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


// ─── Zod Schema ────────────────────────────────────────────────────────────────

type FormValues = z.infer<typeof UploadSchema>;

// ─── Voice Data ────────────────────────────────────────────────────────────────

const VOICES = {
    male: [
        { id: "dave", name: "Dave", description: "Young male, British-Essex, casual & conversational" },
        { id: "daniel", name: "Daniel", description: "Middle-aged male, British, authoritative but warm" },
        { id: "chris", name: "Chris", description: "Male, casual & easy-going" },
    ],
    female: [
        { id: "rachel", name: "Rachel", description: "Young female, American, calm & clear" },
        { id: "sarah", name: "Sarah", description: "Young female, American, soft & approachable" },
    ],
};



// ─── Component ─────────────────────────────────────────────────────────────────

const UploadForm = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pdfInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: { voice: "rachel" },
    });

    const selectedVoice = form.watch("voice");

    // ── File handlers ──────────────────────────────────────────────────────────

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPdfFile(file);
        form.setValue("pdf", file, { shouldValidate: true });
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        form.setValue("coverImage", file, { shouldValidate: true });
    };

    const removePdf = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPdfFile(null);
        form.setValue("pdf", undefined as unknown as File, { shouldValidate: false });
        if (pdfInputRef.current) pdfInputRef.current.value = "";
    };

    const removeCover = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCoverFile(null);
        form.setValue("coverImage", undefined, { shouldValidate: false });
        if (coverInputRef.current) coverInputRef.current.value = "";
    };

    // ── Submit ─────────────────────────────────────────────────────────────────

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            // TODO: wire up to your API
            console.log("Form submitted:", data);
            await new Promise((r) => setTimeout(r, 2000)); // placeholder
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            {isSubmitting && <LoadingOverlay />}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="new-book-wrapper">

                    {/* ── PDF Upload ─────────────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="pdf"
                        render={() => (
                            <FormItem>
                                <FormLabel className="form-label">Book PDF File</FormLabel>
                                <FormControl>
                                    <div
                                        className={`upload-dropzone border-2 border-dashed border-(--border-medium) ${pdfFile ? "upload-dropzone-uploaded" : ""}`}
                                        onClick={() => pdfInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pdfInputRef.current?.click(); } }}
                                    >
                                        <input
                                            ref={pdfInputRef}
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={handlePdfChange}
                                        />
                                        {pdfFile ? (
                                            <div className="flex items-center gap-3 px-4">
                                                <Upload className="upload-dropzone-icon !w-6 !h-6 shrink-0" />
                                                <span className="upload-dropzone-text truncate max-w-[260px]">{pdfFile.name}</span>
                                                <button
                                                    type="button"
                                                    className="upload-dropzone-remove shrink-0"
                                                    onClick={removePdf}
                                                    aria-label="Remove PDF"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="file-upload-shadow">
                                                <Upload className="upload-dropzone-icon" />
                                                <p className="upload-dropzone-text">Click to upload PDF</p>
                                                <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Cover Image Upload ─────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={() => (
                            <FormItem>
                                <FormLabel className="form-label">Cover Image (Optional)</FormLabel>
                                <FormControl>
                                    <div
                                        className={`upload-dropzone border-2 border-dashed border-[var(--border-medium)] ${coverFile ? "upload-dropzone-uploaded" : ""}`}
                                        onClick={() => coverInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); coverInputRef.current?.click(); } }}
                                    >
                                        <input
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleCoverChange}
                                        />
                                        {coverFile ? (
                                            <div className="flex items-center gap-3 px-4">
                                                <ImageIcon className="upload-dropzone-icon !w-6 !h-6 shrink-0" />
                                                <span className="upload-dropzone-text truncate max-w-[260px]">{coverFile.name}</span>
                                                <button
                                                    type="button"
                                                    className="upload-dropzone-remove shrink-0"
                                                    onClick={removeCover}
                                                    aria-label="Remove cover image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="file-upload-shadow">
                                                <ImageIcon className="upload-dropzone-icon" />
                                                <p className="upload-dropzone-text">Click to upload cover image</p>
                                                <p className="upload-dropzone-hint">Leave empty to auto-generate from PDF</p>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Title ─────────────────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="ex: Rich Dad Poor Dad"
                                        className="form-input border border-[var(--border-subtle)]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Author ────────────────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Author Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="ex: Robert Kiyosaki"
                                        className="form-input border border-[var(--border-subtle)]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Voice Selector ────────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>

                                {/* Male Voices */}
                                <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Male Voices</p>
                                <div className="voice-selector-options flex-wrap mb-5">
                                    {VOICES.male.map((voice) => (
                                        <label
                                            key={voice.id}
                                            htmlFor={`${field.name}-${voice.id}`}
                                            className={`voice-selector-option ${
                                                selectedVoice === voice.id
                                                    ? "voice-selector-option-selected"
                                                    : "voice-selector-option-default"
                                            }`}
                                        >
                                            <FormControl>
                                                <input
                                                    type="radio"
                                                    id={`${field.name}-${voice.id}`}
                                                    value={voice.id}
                                                    checked={field.value === voice.id}
                                                    onChange={() => field.onChange(voice.id)}
                                                    className="sr-only"
                                                />
                                            </FormControl>
                                            <div className="flex items-center gap-2 w-full">
                                                <span
                                                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                        selectedVoice === voice.id
                                                            ? "border-[var(--accent-warm)]"
                                                            : "border-[var(--border-medium)]"
                                                    }`}
                                                >
                                                    {selectedVoice === voice.id && (
                                                        <span className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
                                                    )}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-[var(--text-primary)] text-sm leading-5">
                                                        {voice.name}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-4">
                                                        {voice.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Female Voices */}
                                <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Female Voices</p>
                                <div className="voice-selector-options flex-wrap">
                                    {VOICES.female.map((voice) => (
                                        <label
                                            key={voice.id}
                                            htmlFor={`${field.name}-${voice.id}`}
                                            className={`voice-selector-option ${
                                                selectedVoice === voice.id
                                                    ? "voice-selector-option-selected"
                                                    : "voice-selector-option-default"
                                            }`}
                                        >
                                            <FormControl>
                                                <input
                                                    type="radio"
                                                    id={`${field.name}-${voice.id}`}
                                                    value={voice.id}
                                                    checked={field.value === voice.id}
                                                    onChange={() => field.onChange(voice.id)}
                                                    className="sr-only"
                                                />
                                            </FormControl>
                                            <div className="flex items-center gap-2 w-full">
                                                <span
                                                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                        selectedVoice === voice.id
                                                            ? "border-[var(--accent-warm)]"
                                                            : "border-[var(--border-medium)]"
                                                    }`}
                                                >
                                                    {selectedVoice === voice.id && (
                                                        <span className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
                                                    )}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-[var(--text-primary)] text-sm leading-5">
                                                        {voice.name}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-secondary)] leading-4">
                                                        {voice.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Submit ────────────────────────────────────────────── */}
                    <button type="submit" className="form-btn" disabled={isSubmitting}>
                        Begin Synthesis
                    </button>
                </form>
            </Form>
        </>
    );
};

export default UploadForm;
