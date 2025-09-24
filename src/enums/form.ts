
export enum eViewScreenMode {
    Desktop = 'desktop',
    Mobile = 'mobile',
}

export enum eFormPageType {
    SinglePage = 'single_page',
    MultiStep = 'multi_step',
}

export enum eViewMode {
    Builder = 'builder',
    Workflow = 'workflow',
    Preview = 'preview'
}

export enum eWorkflowDirection {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
};

export enum eQuestionType {
    shortText = "short_text",
    longText = "long_text",
    number = "number",
    date = "date",
    file = "file",
    detail = "detail",
    radio = "radio",
    checkbox = "checkbox",
    // dropdown = "dropdown",
    email = "email",
    phone = "phone",
    address = "address",
    website = "website",
    starRating = "star_rating",
    // barChoiceRating = "bar_choice_rating",
    // imageChoiceRating = "image_choice_rating",
}

export enum eFormType {
    reachOut = "reach-out",
    embedded = "embedded"
}

export enum eFormStatus {
    draft = "draft",
    published = "published",
    archived = "archived"
}