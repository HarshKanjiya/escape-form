import FormBuilderWrapper from "@/components/formBuilder/formBuilderWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Form Editor",
}


export default function Page() {
    return (
        <FormBuilderWrapper />
    );
}