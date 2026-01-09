import { QuestionOption } from "@prisma/client";

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