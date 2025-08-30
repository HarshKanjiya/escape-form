'use client'

import { eFormStatus, eFormType, eQuestionType, eViewMode } from '@/enums/form';
import { Form, FormUpdate } from '@/types/db';
import { IThankYouScreen, IWelcomeScreen, IQuestion, IWorkflowConnection } from '@/types/form';
import { create } from 'zustand';

const defaultFormSettings: FormUpdate = {
    name: 'Untitled Form',
    description: null,
    project_id: '',
    logo_url: null,
    thank_you_screen: {
        enabled: true,
        title: 'Thank you!',
        description: 'Your response has been recorded.',
    },
    welcome_screen: {
        enabled: true,
        title: 'Welcome to our form',
        description: 'Thank you for taking the time to fill out this form.',
        button_text: 'Start',
    },
    password_hash: null,
    require_consent: false,
    theme: null,
    unique_subdomain: null,
    custom_domain: null,
    analytics_enabled: true,
    type: 'reach-out',
    close_at: null,
    open_at: null,
    allow_anonymous: true,
    config: {},
    status: 'draft',
    multiple_submissions: true,
    max_responses: null,
    password_protected: false,
}


interface IFormBuilderStore {
    // CONFIG
    name: string;
    description?: string;
    project_id: string;
    logo_url?: string;
    unique_subdomain?: string;
    custom_domain?: string;
    password_hash?: string;
    analytics_enabled: boolean;
    allow_anonymous: boolean;
    multiple_submissions: boolean;
    password_protected: boolean;
    require_consent: boolean;
    close_at?: Date;
    open_at?: Date;
    type: eFormType;
    status: eFormStatus;
    theme?: any;
    created_at?: Date;
    updated_at?: Date;
    created_by?: string;

    // APP
    max_responses: number;

    // FORM
    welcome_screen?: IWelcomeScreen;
    thank_you_screen?: IThankYouScreen;
    config: any;

    // STATE
    selectedQuestionId?: string;
    selectedQuestion?: IQuestion;
    questions: IQuestion[];
    viewMode: eViewMode,
    dataSource: FormUpdate,
    connections: IWorkflowConnection[];
    isSaving: boolean;

    initForm: (form: Form) => void;
    addQuestions: (questions: eQuestionType[]) => void;
    updateQuestion: (id: string, question: IQuestion) => void;
    changeQuestionSequence: (oldIndex: number, newIndex: number) => void;
    moveQuestion: (id: string, position: { x: number; y: number }) => void;
    removeQuestion: (questionId: string) => void;
    updateForm: (form: FormUpdate) => void;
    addConnection: (connection: IWorkflowConnection) => void;
    removeConnection: (connectionId: string) => void;

}

export const useFormBuilder = create<IFormBuilderStore>((set, get) => ({
    name: '',
    description: '',
    project_id: '',
    logo_url: '',
    unique_subdomain: '',
    custom_domain: '',
    password_hash: '',
    analytics_enabled: false,
    allow_anonymous: false,
    multiple_submissions: false,
    password_protected: false,
    require_consent: false,
    close_at: undefined,
    open_at: undefined,
    type: eFormType.reachOut,
    status: eFormStatus.draft,
    theme: undefined,
    created_at: undefined,
    updated_at: undefined,
    created_by: undefined,
    max_responses: 0,
    welcome_screen: undefined,
    thank_you_screen: undefined,
    config: {},
    isSaving: false,

    selectedQuestionId: undefined,
    selectedQuestion: undefined,
    questions: [],
    viewMode: eViewMode.Builder,
    dataSource: defaultFormSettings,
    connections: [],

    initForm: (form: Form) => {
        set({
            name: form.name,
            description: form.description || undefined,
            project_id: form.project_id,
            logo_url: form.logo_url || undefined,
            unique_subdomain: form.unique_subdomain || undefined,
            custom_domain: form.custom_domain || undefined,
            password_hash: form.password_hash || undefined,
            analytics_enabled: form.analytics_enabled,
            allow_anonymous: form.allow_anonymous,
            multiple_submissions: form.multiple_submissions,
            password_protected: form.password_protected,
            require_consent: form.require_consent,
            close_at: form.close_at ? new Date(form.close_at) : undefined,
            open_at: form.open_at ? new Date(form.open_at) : undefined,
            type: form.type as eFormType,
            status: form.status as eFormStatus,
            theme: form.theme || undefined,
            created_at: new Date(form.created_at),
            updated_at: new Date(form.updated_at),
            created_by: form.created_by,
            max_responses: form.max_responses || 0,
            welcome_screen: form.welcome_screen ? (form.welcome_screen as unknown as IWelcomeScreen) : undefined,
            thank_you_screen: form.thank_you_screen ? (form.thank_you_screen as unknown as IThankYouScreen) : undefined,
            config: form.config || {},
            dataSource: {
                name: form.name,
                description: form.description,
                project_id: form.project_id,
                logo_url: form.logo_url,
                thank_you_screen: form.thank_you_screen,
                welcome_screen: form.welcome_screen,
                password_hash: form.password_hash,
                require_consent: form.require_consent,
                theme: form.theme,
                unique_subdomain: form.unique_subdomain,
                custom_domain: form.custom_domain,
                analytics_enabled: form.analytics_enabled,
                type: form.type,
                close_at: form.close_at,
                open_at: form.open_at,
                allow_anonymous: form.allow_anonymous,
                config: form.config || {},
                status: form.status,
                multiple_submissions: form.multiple_submissions,
                max_responses: form.max_responses,
                password_protected: form.password_protected,
            }
        });
    },

    addQuestions: (newQuestions: eQuestionType[]) => {
        const { questions } = get();
        const exeLen = questions?.length || 0;

        const newQues: IQuestion[] = [];
        newQuestions.forEach((type, index) => {
            const newQuestion: IQuestion = {
                id: `question-${Date.now()}`,
                type,
                title: `New ${type.replace('_', ' ')} question`,
                required: false,
                position: { x: (exeLen + index) * 200, y: 200 },
                options: type === eQuestionType.checkbox || type === eQuestionType.dropdown ? ['Option 1', 'Option 2'] : undefined,
            };
            newQues.push(newQuestion);
        })
        set({ questions: [...questions, ...newQues] });
    },

    updateQuestion: (id: string, question: IQuestion) => {
        const { questions } = get();
        const updatedQuestions = questions.map(q => q.id === id ? question : q);
        set({ questions: updatedQuestions });
    },

    changeQuestionSequence: (oldIndex: number, newIndex: number) => {
        const { questions } = get();
        const updatedQuestions = [...questions];
        const [movedQuestion] = updatedQuestions.splice(oldIndex, 1);
        updatedQuestions.splice(newIndex, 0, movedQuestion);
        set({ questions: updatedQuestions });
    },

    moveQuestion: (id: string, position: { x: number; y: number }) => {
        const { questions } = get();
        const updatedQuestions = questions.map(q => q.id === id ? { ...q, position } : q);
        set({ questions: updatedQuestions });
    },

    removeQuestion: (questionId: string) => {
        const { questions } = get();
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        set({ questions: updatedQuestions });
    },

    updateForm: (form: FormUpdate) => {
        const { dataSource } = get();
        set({ dataSource: { ...dataSource, ...form } });
    },

    addConnection: (connection: IWorkflowConnection) => {
        const { connections } = get();
        set({ connections: [...connections, connection] });
    },

    removeConnection: (connectionId: string) => {
        const { connections } = get();
        const updatedConnections = connections.filter(c => c.id !== connectionId);
        set({ connections: updatedConnections });
    },
}))
