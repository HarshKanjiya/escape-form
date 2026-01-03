"use client";

import { Form, Response } from "@prisma/client";
import PreviewResponses from "./previewResponses";
import { useEffect, useState } from "react";
import { showError } from "@/lib/utils";

interface FormResponsesProps {
    form: Form;
}

export default function FormResponses({ form }: FormResponsesProps) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Response[]>([]);

    const fetchResponses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/forms/${form.id}/responses`);
            const result = await res.json();
            setData(result.responses);
        } catch (error) {
            showError("Failed to fetch responses");
        }
    }

    useEffect(() => {
    }, []);

    return (
        <PreviewResponses />
    );
}