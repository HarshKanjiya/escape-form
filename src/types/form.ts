export interface Question {
    id: string;
    type: 'short-text' | 'long-text' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'rating' | 'date' | 'email' | 'number' | 'yes-no';
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

export interface FormSettings {
    name: string;
    icon: string;
    description: string;
    customDomain: string;
    theme: 'light' | 'dark' | 'custom';
    colorPalette: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
    isPublic: boolean;
    welcomeScreen: {
        enabled: boolean;
        title: string;
        description: string;
        buttonText: string;
    };
    thankYouScreen: {
        enabled: boolean;
        title: string;
        description: string;
    };
    timing: {
        enabled: boolean;
        openTime: string;
        closeTime: string;
    };
    password?: string;
    anonymous: boolean;
    consentRequired: boolean;
    timePerQuestion?: number;
    multipleSubmissions: boolean;
}

export interface WorkflowConnection {
    id: string;
    from: string;
    to: string;
    condition?: {
        field: string;
        operator: string;
        value: string | number;
    };
}

export type ViewMode = 'builder' | 'workflow' | 'preview';
export type WorkflowDirection = 'horizontal' | 'vertical';