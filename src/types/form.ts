import { eQuestionType } from "@/enums/form";

export interface IQuestion {
    id: string;
    type: eQuestionType;
    question: string;
    placeholder?: string;
    description?: string;
    required: boolean;
    options?: string[];
    validation?: {
        min?: number | Date | undefined;
        max?: number | Date | undefined;
        pattern?: string;
        maxSizeMB?: number;                     // for file upload field 
        randomize?: boolean;                    // for multiple choice, checkbox, dropdown
        anyFileType?: boolean;                  // for file upload field
        allowedFileTypes?: string[];            // MIME types
        allowAnyCountry?: boolean;                // for phone number field
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

export const fileTypes = [
    { label: 'Image (JPEG)', value: 'image/jpeg' },
    { label: 'Image (PNG)', value: 'image/png' },
    { label: 'Image (GIF)', value: 'image/gif' },
    { label: 'Text File', value: 'text/plain' },
    { label: 'CSV File', value: 'text/csv' },
    { label: 'PDF', value: 'application/pdf' },
    { label: 'Word Document', value: 'application/msword' },
    { label: 'Word Document (OpenXML)', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { label: 'Excel Spreadsheet', value: 'application/vnd.ms-excel' },
    { label: 'Excel Spreadsheet (OpenXML)', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { label: 'PowerPoint Presentation', value: 'application/vnd.ms-powerpoint' },
    { label: 'PowerPoint Presentation (OpenXML)', value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
    { label: 'ZIP Archive', value: 'application/zip' },
    { label: 'RAR Archive', value: 'application/vnd.rar' },
    { label: '7z Archive', value: 'application/x-7z-compressed' }
];