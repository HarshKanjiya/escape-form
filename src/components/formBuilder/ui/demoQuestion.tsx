import { QuestionType } from "@/generated/prisma";
import { Upload, ChevronDown, Star } from "lucide-react";

const DemoQuestion = ({ questionType }: { questionType: QuestionType }) => {
    switch (questionType) {
        case QuestionType.TEXT_SHORT:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your first name?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Enter only your given name.
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 text-lg bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60 placeholder:italic"
                                    placeholder="John"
                                    disabled
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                    0 / 30
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                <span className="text-base">ⓘ</span>
                                <span>Minimum 2 characters required</span>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case QuestionType.TEXT_LONG:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>Tell us briefly about your background</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                A short professional summary (2-3 sentences).
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                className="w-full px-4 py-4 text-lg bg-background border-2 border-border rounded-lg focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60 placeholder:italic resize-none h-32"
                                placeholder="I have 5 years of experience in..."
                                disabled
                            />
                        </div>
                    </div>
                </div>
            );

        case QuestionType.NUMBER:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your age?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full px-4 py-4 text-lg bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60 placeholder:italic"
                                    placeholder="e.g. 29"
                                    disabled
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                    1 - 120
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                <span className="text-base">ⓘ</span>
                                <span>Minimum value 1 required</span>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case QuestionType.DATE:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your birth date?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Month / Day / Year
                            </div>
                        </div>
                        <div className="flex items-end gap-4 max-w-md">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Month</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 text-center text-2xl font-mono bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/50"
                                        placeholder="MM"
                                        maxLength={2}
                                        disabled
                                    />
                                </div>
                            </div>
                            <span className="text-2xl text-muted-foreground pb-3">/</span>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Day</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 text-center text-2xl font-mono bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/50"
                                        placeholder="DD"
                                        maxLength={2}
                                        disabled
                                    />
                                </div>
                            </div>
                            <span className="text-2xl text-muted-foreground pb-3">/</span>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 text-center text-2xl font-mono bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/50"
                                        placeholder="YYYY"
                                        maxLength={4}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case QuestionType.FILE_ANY:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>Upload your resume (PDF)</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Max 5MB. PDF only.
                            </div>
                        </div>
                        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-foreground transition-colors mb-4" />
                            <p className="text-lg font-medium text-foreground mb-2">
                                Drop files here or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                                PDF files up to 5MB
                            </p>
                        </div>
                    </div>
                </div>
            );

        case QuestionType.USER_DETAIL:
            return (
                <div className="text-sm italic opacity-60">Detail block preview coming soon.</div>
            );

        case QuestionType.CHOICE_SINGLE:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your gender?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Select one option
                            </div>
                        </div>
                        <div className="space-y-4">
                            {["Male", "Female", "Non-binary", "Prefer not to say"].map((option, i) => (
                                <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="relative">
                                        <div className="w-5 h-5 border-2 border-border rounded-full bg-background group-hover:border-primary transition-colors" />
                                        {i === 0 && <div className="absolute inset-1 bg-primary rounded-full" />}
                                    </div>
                                    <span className="text-lg font-medium text-foreground">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case QuestionType.CHOICE_CHECKBOX:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground">
                                Which programming languages do you use?
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Select all that apply
                            </div>
                        </div>
                        <div className="space-y-4">
                            {["JavaScript", "TypeScript", "Python", "Go"].map((option, i) => (
                                <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="relative">
                                        <div className="w-5 h-5 border-2 border-border rounded-md bg-background group-hover:border-primary transition-colors" />
                                        {(i === 0 || i === 1) && (
                                            <div className="absolute inset-1 bg-primary rounded-sm">
                                                <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-lg font-medium text-foreground">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case QuestionType.INFO_EMAIL:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your email address?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full px-4 py-4 text-lg bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60 placeholder:italic"
                                placeholder="you@example.com"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            );

        case QuestionType.INFO_PHONE:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your mobile number?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <select className="appearance-none px-4 py-4 pr-10 text-lg bg-background border-b-2 border-border focus:border-primary outline-none transition-colors cursor-pointer" disabled>
                                    <option>+91</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="tel"
                                    className="w-full px-4 py-4 text-lg bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60 placeholder:italic"
                                    placeholder="(555) 123-4567"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );

        case QuestionType.USER_ADDRESS:
            return (
                <div className="p-8 w-full max-w-3xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>What is your mailing address?</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Include apartment or suite if applicable.
                            </div>
                        </div>
                        <div className="grid gap-6">
                            {[
                                { label: "Address", required: true, placeholder: "123 Main Street" },
                                { label: "Address 2", required: false, placeholder: "Apt 4B (optional)" },
                                { label: "City", required: true, placeholder: "New York" },
                                { label: "State", required: true, placeholder: "NY" },
                                { label: "Country", required: true, placeholder: "United States" },
                                { label: "Zip", required: true, placeholder: "10001" }
                            ].map((field, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">
                                        {field.label}
                                        {field.required && <span className="text-destructive ml-1">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 text-base bg-background border-2 border-border rounded-lg focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60"
                                        placeholder={field.placeholder}
                                        disabled
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case QuestionType.INFO_URL:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground">
                                What is your personal website?
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                Include http:// or https://
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="url"
                                className="w-full px-4 py-4 text-lg bg-background border-b-2 border-border focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60 placeholder:italic"
                                placeholder="https://yourwebsite.com"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            );

        case QuestionType.RATING_STAR:
            return (
                <div className="p-8 w-full max-w-2xl mx-auto">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <span>Rate your overall satisfaction</span>
                                <span className="text-destructive text-lg">*</span>
                            </div>
                            <div className="text-base text-muted-foreground leading-relaxed">
                                5 being extremely satisfied
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 py-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="group transition-transform hover:scale-110 focus:outline-none focus:scale-110" disabled>
                                    <Star
                                        className={`w-10 h-10 transition-colors ${star <= 4
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-muted-foreground hover:text-yellow-400 group-hover:fill-yellow-400'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-center">
                            <span className="text-lg font-medium text-foreground">4 out of 5 stars</span>
                        </div>
                    </div>
                </div>
            );

        default:
            return <div className="text-sm italic opacity-60">Demo for {questionType} is not available yet.</div>;
    }
};

export default DemoQuestion;