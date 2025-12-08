import LeadCards from "./LeadCards";

export default function FormOverview() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <LeadCards />
            {/* <Separator />
            <PreviewResponses /> */}
        </div>
    );
}