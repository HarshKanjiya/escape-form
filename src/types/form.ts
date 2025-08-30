import { eQuestionType } from "@/enums/form";

export interface IQuestion {
    id: string;
    type: eQuestionType;
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    logic?: {
        conditions: Array<{
            field: string;
            operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
            value: string | number;
            action: 'show' | 'hide' | 'jump_to';
            target?: string;
        }>;
    };
    position: {
        x: number;
        y: number;
    };
    customCss?: string;
}
export interface IWorkflowConnection {
    id: string;
    from: string;
    to: string;
    condition?: {
        field: string;
        operator: string;
        value: string | number;
    };
}

export interface IWelcomeScreen {
    enabled: boolean;
    title: string;
    description?: string;
    button_text: string;
}

export interface IThankYouScreen {
    enabled: boolean;
    title: string;
    description?: string;
}