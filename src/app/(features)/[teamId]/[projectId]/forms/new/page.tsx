import { FormCreationStepper } from "@/components/forms/FormCreationStepper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Form",
    description: "Create a new form with Escape Form's intuitive form builder",
}

export default function FormCreatePage() {
    return (
        <FormCreationStepper />
    )
}