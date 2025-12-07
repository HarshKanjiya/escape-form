import { Question as PrismaQuestion, QuestionOption } from "@prisma/client";

export type Question = Omit<PrismaQuestion, 'metadata'> & {
    metadata?: IQuestionMetadata,
    options?: QuestionOption[];
}

export interface IQuestionMetadata {
    min?: number | Date | undefined;
    max?: number | Date | undefined;
    pattern?: string;
    maxSizeMB?: number;                     // for file upload field
    randomize?: boolean;                    // for multiple choice, checkbox, dropdown
    anyFileType?: boolean;                  // for file upload field
    allowedFileTypes?: string[];            // MIME types
    allowAnyCountry?: boolean;              // for phone number field
    allowedCountries?: string[];            // ISO country codes
    starCount?: number;                     // for star rating field
    detailBtnText?: string;                 // for detail field
    userConsentText?: string;               // for consent field
    userConsentRequired?: boolean;          // for consent field

    address?: boolean;                      // for address field
    addressRequired?: boolean;                      // for address field
    address2?: boolean;                     // for address field
    address2Required?: boolean;                     // for address field
    city?: boolean;                         // for address field
    cityRequired?: boolean;                         // for address field
    state?: boolean;                        // for address field
    stateRequired?: boolean;                        // for address field
    zip?: boolean;                          // for address field
    zipRequired?: boolean;                          // for address field
    country?: boolean;                      // for address field
    countryRequired?: boolean;                      // for address field
    postalCode?: boolean;                   // for address field
    postalCodeRequired?: boolean;                   // for address field
}

export interface IAddress {
    address?: boolean;
    address2?: boolean;
    city?: boolean;
    state?: boolean;
    zip?: boolean;
    country?: boolean;
    postalCode?: boolean;
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