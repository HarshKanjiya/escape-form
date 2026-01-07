import { Form } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { FormCard } from "./formCard";
import { CustomCard, CustomCardContent, CustomCardFooter, CustomCardHeader, CustomCardTitle } from "../ui/custom-card";

function FormGridView({ forms, loading, projectId, teamId }: { forms: Partial<Form>[]; loading: boolean, projectId: string, teamId: string }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 3 }).map((_, index) => (
                        <CustomCard key={index}>
                            <CustomCardContent className="h-[136px]">
                                <Skeleton className="h-40 w-full rounded-md" />
                            </CustomCardContent>
                            <CustomCardFooter className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32 rounded-md" />
                                <Skeleton className="h-5 w-14 rounded-md" />
                            </CustomCardFooter>
                        </CustomCard>
                    ))
                    :
                    forms.map((form) => <FormCard key={form.id} form={form} projectId={projectId} teamId={teamId} />)
            }
        </div>
    );
}

export default FormGridView;