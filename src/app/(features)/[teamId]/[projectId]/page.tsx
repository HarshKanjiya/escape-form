import { FormList } from "@/components/forms/formList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects"
}

export default async function FormsPage() {

    return (
        <div className="container mx-auto px-4 py-6 sm:pt-12">
            <FormList />
        </div>
    );
};
