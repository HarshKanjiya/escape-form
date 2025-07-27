import { ProjectListSkeleton } from "@/components/projects/projectListSkeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-6">
            <ProjectListSkeleton />
        </div>
    );
}
