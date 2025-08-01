import { FormCreationStepper } from "@/components/forms/FormCreationStepper";

export const metadata = {
    title: "Create New Form | EF",
    description: "Start building your form with our step-by-step guide.",
}

export default function FormCreatePage() {
    return (
        <FormCreationStepper />
    )
}