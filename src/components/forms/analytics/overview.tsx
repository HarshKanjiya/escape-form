import { Separator } from "@/components/ui/separator";
import LeadCards from "./LeadCards";
import PreviewResponses from "./previewResponses";

export default function FormOverview() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <LeadCards />
            <Separator />
            <PreviewResponses />
        </div>
    );
}