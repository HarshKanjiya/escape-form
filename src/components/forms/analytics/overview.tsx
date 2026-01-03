import { Form } from "@prisma/client";
import LeadCards from "./LeadCards";

interface FormOverviewProps {
    form: Form;
}

export default function FormOverview({ form }: FormOverviewProps) {


    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <LeadCards form={form} />
            {/* <Separator />
            <PreviewResponses /> */}
        </div>
    );
}