"use client";

export default function RightBar() {
    return (
        <div className="bg-background border-l z-30 overflow-visible h-full w-[360px]">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pb-4 overflow-x-hidden">
                    <div className='w-full h-full flex flex-col gap-2'>
                        <div className='pl-3 pr-2 flex items-center justify-between py-2 border-b min-h-13'>
                            <span className='text-md overflow-ellipsis line-clamp-1'>Field Config</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
