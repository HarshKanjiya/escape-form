"use client";

export default function FlowEditor() {
    return (
        <div className="flex-1 relative w-full h-full">
            <div className="absolute inset-0 pointer-events-none border rounded-2xl opacity-20 custom-bg z-auto left-0 right-0">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1440 900"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern id="lines135" patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(135)">
                            <rect x="0" y="30" width="64" height="1" fill="#e5e7eb" opacity="0.05" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="1440" height="900" fill="url(#lines135)" />
                </svg>
            </div>
        </div>
    );
}
