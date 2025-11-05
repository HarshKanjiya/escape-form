import { Form } from "@/generated/prisma";
import { Skeleton } from "../ui/skeleton";
import { FormCard } from "./formCard";

function FormGridView({ forms, loading }: { forms: Partial<Form>[]; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 w-full" />
                    ))
                    :
                    forms.map((form) => <FormCard key={form.id} form={form} />)
            }
        </div>
    );
}

export default FormGridView;