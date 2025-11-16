'use client'

import { apiConstants } from '@/constants/api.constants';
import { eFormPageType, eQuestionType, eViewMode, eViewScreenMode } from '@/enums/form';
import { Form, FormStatus, FormType } from '@/generated/prisma';
import api from '@/lib/axios';
import { ActionResponse } from '@/types/common';
import { IThankYouScreen, IWelcomeScreen, IQuestion, IWorkflowConnection } from '@/types/form';
import { create } from 'zustand';

const defaultFormSettings: Partial<Form> = {
    name: 'Untitled Form',
    description: null,
    projectId: '',
    logoUrl: null,
    thankYouScreen: {
        enabled: true,
        title: 'Thank you!',
        description: 'Your response has been recorded.',
    },
    welcomeScreen: {
        enabled: true,
        title: 'Welcome to our form',
        description: 'Thank you for taking the time to fill out this form.',
        buttonText: 'Start',
    },
    requireConsent: false,
    theme: null,
    uniqueSubdomain: null,
    customDomain: null,
    analyticsEnabled: true,
    type: FormType.REACH_OUT,
    closeAt: null,
    openAt: null,
    allowAnonymous: true,
    config: [],
    status: FormStatus.DRAFT,
    multipleSubmissions: true,
    maxResponses: null,
    passwordProtected: false,
}


interface IFormBuilderStore {
    // CONFIG
    id?: string;
    name: string;
    description?: string;
    projectId: string;
    logoUrl?: string;
    uniqueSubdomain?: string;
    customDomain?: string;
    analyticsEnabled: boolean;
    allowAnonymous: boolean;
    multipleSubmissions: boolean;
    passwordProtected: boolean;
    requireConsent: boolean;
    closeAt?: Date;
    openAt?: Date;
    type: FormType;
    status: FormStatus;
    theme?: unknown;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;

    // APP
    maxResponses: number;

    // FORM
    welcomeScreen?: IWelcomeScreen | null;
    thankYouScreen?: IThankYouScreen | null;
    config: unknown;

    // STATE
    selectedQuestionId: string | null;
    selectedQuestion: IQuestion | null;
    questions: IQuestion[];
    viewMode: eViewMode,
    dataSource: Partial<Form>,
    connections: IWorkflowConnection[];
    isSaving: boolean;
    isLoading: boolean;
    viewScreenMode: eViewScreenMode;
    formPageType: eFormPageType;

    initForm: (form: Form) => void;
    addQuestions: (questions: eQuestionType[]) => void;
    updateQuestion: (id: string, question: Partial<IQuestion>) => void;
    changeQuestionSequence: (oldIndex: number, newIndex: number) => void;
    moveQuestion: (id: string, position: { x: number; y: number }) => void;
    deleteQuestion: (questionId: string) => void;
    updateForm: (form: Partial<Form>) => void;
    addConnection: (connection: IWorkflowConnection) => void;
    removeConnection: (connectionId: string) => void;
    setViewScreenMode: (mode: eViewScreenMode) => void;
    setViewMode: (mode: eViewMode) => void;
    setSelectedQuestionId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    setIsSaving: (loading: boolean) => void;

}

export const useFormBuilder = create<IFormBuilderStore>((set, get) => ({
    id: '',
    name: '',
    description: '',
    projectId: '',
    logoUrl: '',
    uniqueSubdomain: '',
    customDomain: '',
    analyticsEnabled: false,
    allowAnonymous: false,
    multipleSubmissions: false,
    passwordProtected: false,
    requireConsent: false,
    closeAt: undefined,
    openAt: undefined,
    type: FormType.REACH_OUT,
    status: FormStatus.DRAFT,
    theme: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    createdBy: undefined,
    maxResponses: 0,
    welcomeScreen: undefined,
    thankYouScreen: undefined,
    config: {},
    isSaving: false,
    isLoading: false,

    selectedQuestionId: null,
    selectedQuestion: null,
    questions: [],
    viewMode: eViewMode.Builder,
    dataSource: defaultFormSettings,
    connections: [],
    viewScreenMode: eViewScreenMode.Desktop,
    formPageType: eFormPageType.MultiStep,

    initForm: (form: Form) => {

        const formData: Partial<IFormBuilderStore> = {
            id: form.id,
            name: form.name,
            description: form.description || undefined,
            projectId: form.projectId,
            logoUrl: form.logoUrl || undefined,
            uniqueSubdomain: form.uniqueSubdomain || undefined,
            customDomain: form.customDomain || undefined,
            analyticsEnabled: !!form.analyticsEnabled,
            allowAnonymous: !!form.allowAnonymous,
            multipleSubmissions: !!form.multipleSubmissions,
            passwordProtected: !!form.passwordProtected,
            requireConsent: !!form.requireConsent,
            closeAt: form.closeAt ? new Date(form.closeAt) : undefined,
            openAt: form.openAt ? new Date(form.openAt) : undefined,
            type: form.type as FormType,
            status: form.status as FormStatus,
            theme: form.theme || undefined,
            createdAt: form.createdAt!,
            updatedAt: form.updatedAt!,
            createdBy: form.createdBy,
            maxResponses: form.maxResponses || 0,
            welcomeScreen: form.welcomeScreen ? form.welcomeScreen as unknown as IWelcomeScreen : null,
            thankYouScreen: form.thankYouScreen ? form.thankYouScreen as unknown as IThankYouScreen : null,
            config: form.config || [],
            dataSource: {
                id: form.id,
                name: form.name,
                description: form.description,
                projectId: form.projectId,
                logoUrl: form.logoUrl,
                thankYouScreen: form.thankYouScreen,
                welcomeScreen: form.welcomeScreen,
                requireConsent: form.requireConsent,
                theme: form.theme,
                uniqueSubdomain: form.uniqueSubdomain,
                customDomain: form.customDomain,
                analyticsEnabled: form.analyticsEnabled,
                type: form.type,
                closeAt: form.closeAt,
                openAt: form.openAt,
                allowAnonymous: form.allowAnonymous,
                config: form.config || [],
                status: form.status,
                multipleSubmissions: form.multipleSubmissions,
                maxResponses: form.maxResponses,
                passwordProtected: form.passwordProtected,
            },
        }

        if (Array.isArray(form.config) && form.config.length) {
            const config = form.config as unknown as IQuestion[];
            formData.questions = config;
            formData.selectedQuestionId = config[0].id;
            formData.selectedQuestion = config[0] ?? null;
        }

        set({ ...formData });
    },

    addQuestions: (newQuestions: eQuestionType[]) => {
        const { questions } = get();
        const exeLen = questions?.length || 0;

        const newQues: IQuestion[] = [];
        newQuestions.forEach((type, index) => {
            const newQuestion: IQuestion = prepareNewQuestionObject(type, exeLen, index);
            newQues.push(newQuestion);
        })
        const newQuestionsList = [...questions, ...newQues];

        const lastQue = newQuestionsList[newQuestionsList.length - 1];
        set({ questions: newQuestionsList, selectedQuestionId: lastQue.id, selectedQuestion: lastQue });
        updateFormDetails(get().id!, get().questions!, get().setIsSaving);
    },

    updateQuestion: (id: string, question: Partial<IQuestion>) => {
        console.log('POSITION [ called ]', question);
        const { questions, selectedQuestionId, selectedQuestion } = get();
        const updatedQuestions = questions.map(q => q.id === id ? { ...q, ...question } : q);
        const changes: Partial<IFormBuilderStore> = { questions: updatedQuestions };
        if (id === selectedQuestionId) changes['selectedQuestion'] = { ...selectedQuestion, ...question } as IQuestion;
        set(changes);
        updateFormDetails(get().id!, get().questions!, get().setIsSaving);
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

    deleteQuestion: (questionId: string) => {
        const { questions, selectedQuestionId } = get();
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        const changes: Partial<IFormBuilderStore> = { questions: updatedQuestions };
        if (questionId === selectedQuestionId) {
            if (questions?.length) {
                changes['selectedQuestion'] = questions[0];
                changes['selectedQuestionId'] = questions[0].id;
            }
            else changes['selectedQuestion'] = changes['selectedQuestionId'] = null;
        }
        set(changes);
        updateFormDetails(get().id!, get().questions!, get().setIsSaving);
    },

    updateForm: (form: Partial<Form>) => {
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

    setViewMode: (mode: eViewMode) => {
        set({ viewMode: mode });
    },

    setViewScreenMode: (mode: eViewScreenMode) => {
        set({ viewScreenMode: mode });
    },

    setSelectedQuestionId: (id: string | null) => {
        const { questions } = get();
        set({
            selectedQuestion: questions.find(q => q.id === id) || null,
            selectedQuestionId: id
        });
    },

    setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setIsSaving: (loading: boolean) => {
        set({ isSaving: loading });
    },

}))


const updateFormDetails = async (id: string, config: IQuestion[], setSaving: (isSaving: boolean) => void): Promise<boolean> => {
    setSaving(true);
    const dto = { id, config };
    try {
        const response = await api.put<ActionResponse>(apiConstants.form.updateForm(id), dto);
        if (!response.data.success) {
            console.error('Error updating form details:', response.data.message);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error updating form details:', error);
        return false;
    } finally {
        setSaving(false);
    }
}


const prepareNewQuestionObject = (type: eQuestionType, exeLen: number, index: number): IQuestion => {
    const baseObject: IQuestion = {
        id: `question-${Date.now()}`,
        type,
        question: `New ${type.replace('_', ' ')} question (Click to edit)`,
        placeholder: `Enter your answer`,
        required: false,
        options: type === eQuestionType.checkbox || type === eQuestionType.radio ? ['Option 1', 'Option 2'] : undefined,
        position: { x: (exeLen + index) * 200, y: 200 },
    };

    switch (type) {
        case eQuestionType.shortText:
        case eQuestionType.longText:
        case eQuestionType.number:
            baseObject.validation = { min: undefined, max: undefined };
            break;
        case eQuestionType.checkbox:
        case eQuestionType.radio:
            // case eQuestionType.dropdown:
            baseObject.options = ['Option 1', 'Option 2'];
            baseObject.validation = { randomize: false };
            break;

        case eQuestionType.phone:
            baseObject.validation = { allowAnyCountry: true };
            break;
        case eQuestionType.detail:
            baseObject.validation = { detailBtnText: 'Continue' };
            baseObject.question = 'Click to add details...';
            break;
        default:
            break;
    }

    return baseObject;
};
