'use client'

import { apiConstants } from '@/constants/api.constants';
import { createErrorMessage, deleteErrorMessage, updateErrorMessage } from '@/constants/messages';
import { eViewMode, eViewScreenMode } from '@/enums/form';
import { Edge, Form, FormStatus, FormType, QuestionOption, QuestionType } from '@/generated/prisma';
import api from '@/lib/axios';
import { showError } from '@/lib/utils';
import { ActionResponse } from '@/types/common';
import { IQuestionMetadata, Question } from '@/types/form';
import { create } from 'zustand';

const defaultFormSettings: Partial<Form> = {
    name: 'Untitled Form',
    description: null,
    projectId: '',
    logoUrl: null,
    requireConsent: false,
    theme: null,
    uniqueSubdomain: null,
    customDomain: null,
    analyticsEnabled: true,
    type: FormType.REACH_OUT,
    closeAt: null,
    openAt: null,
    allowAnonymous: true,
    status: FormStatus.DRAFT,
    multipleSubmissions: true,
    maxResponses: null,
    passwordProtected: false,
}


interface IFormBuilderStore {
    formId: string | null;
    dataSource: Partial<Form>;
    questions: Question[];
    edges: Edge[];

    // STATE
    selectedQuestionId: string | null;
    selectedQuestion: Question | null;
    viewMode: eViewMode,
    viewScreenMode: eViewScreenMode;

    savingCount: number;
    isLoading: boolean;

    // Core methods
    initForm: (form: Form, questions: Question[]) => void;
    // updateForm: (form: Partial<Form>) => Promise<void>;

    // Question methods
    createQuestions: (questions: QuestionType[]) => Promise<boolean>;
    updateQuestion: (questionId: string, question: Partial<Question>) => Promise<void>;
    deleteQuestion: (questionId: string) => Promise<void>;

    // Flow methods
    addEdge: (edge: Edge) => Promise<void>;
    updateEdge: (edgeId: string, edge: Partial<Edge>) => Promise<void>;
    removeEdge: (edgeId: string) => Promise<void>;

    // State Methods
    setIsLoading: (loading: boolean) => void;
    // addSavingCount: () => void;
    // removeSavingCount: () => void;
    setViewMode: (mode: eViewMode) => void;
    setViewScreenMode: (mode: eViewScreenMode) => void;
    setSelectedQuestionId: (id: string | null) => void;
}

export const useFormBuilder = create<IFormBuilderStore>((set, get) => ({
    formId: null,
    dataSouce: {},
    questions: [],
    edges: [],

    savingCount: 0,
    isLoading: false,

    selectedQuestionId: null,
    selectedQuestion: null,

    dataSource: defaultFormSettings,
    connections: [],
    viewMode: eViewMode.Builder,
    viewScreenMode: eViewScreenMode.Desktop,


    // #region Core methods
    initForm: (form: Form, questions: Question[]) => {
        const formData: Partial<IFormBuilderStore> = {
            formId: form.id,
            dataSource: form
        }

        if (questions.length) {
            formData.questions = questions;
            formData.selectedQuestionId = questions[0].id;
            formData.selectedQuestion = questions[0];
        } else {
            formData.questions = [];
            formData.selectedQuestionId = null;
            formData.selectedQuestion = null;
        }

        set({ ...formData });
    },

    // #region Question methods
    createQuestions: async (newQuestionTypes: QuestionType[]) => {
        const { questions, formId } = get();

        if (!formId) {
            console.log("createQuestions :: FORM ID NOT FOUND!!")
            return false
        }

        const queLen = questions?.length || 0;

        const _newQues: Partial<Question>[] = [];
        newQuestionTypes.forEach((queType, ind) => {
            _newQues.push(prepareNewQuestionObject(formId, queType, queLen, ind))
        })
        try {
            set((state) => ({ savingCount: state.savingCount + 1 }))
            const response = await api.post<ActionResponse<Question[]>>(apiConstants.quesiton.createQuestions(formId), { data: _newQues });
            if (!response?.data?.success) {
                showError(response.data.message || createErrorMessage('question(s)'));
                return false;
            }
            const newQues = response?.data?.data || [];
            if (!newQues.length) return false;

            set({
                questions: [...questions, ...newQues],
                selectedQuestion: newQues[newQues.length - 1],
                selectedQuestionId: newQues[newQues.length - 1].id,
            })
            return true;
        }
        catch (err: unknown) {
            console.log('Err While creating Questions :>> ', err);
            showError(createErrorMessage('question(s)'));
            return false;
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },

    updateQuestion: async (questionId: string, question: Partial<Question>) => {
        const { questions: previousQuestions, formId } = get();

        if (!formId) {
            console.log("updateQuestion :: FORM ID NOT FOUND!!")
            return;
        }

        set((state) => ({
            questions: state.questions.map((q) => {
                if (q?.id !== questionId) return q;

                if (question.metadata) {
                    return {
                        ...q, ...question,
                        metadata: {
                            ...(q.metadata),
                            ...(question.metadata)
                        }
                    }
                }
                return { ...q, ...question }
            }),
            savingCount: state.savingCount + 1,
        }));

        try {
            const response = await api.patch<ActionResponse<Question[]>>(apiConstants.quesiton.updateQuestions(formId, questionId), question);
            if (!response?.data?.success) {
                showError(response.data.message || updateErrorMessage('question'));
                set({ questions: previousQuestions });
                return;
            }
        }
        catch (err: unknown) {
            console.log('Err While updating Question :>> ', err);
            showError(createErrorMessage('question(s)'));
            set({ questions: previousQuestions });
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },

    deleteQuestion: async (questionId: string) => {
        const { questions: previousQuestions, formId } = get();

        if (!formId) {
            console.log("updateQuestion :: FORM ID NOT FOUND!!")
            return;
        }

        set((state) => ({
            questions: state.questions.filter((q) => q?.id !== questionId),
            savingCount: state.savingCount + 1,
        }));

        try {
            const response = await api.delete<ActionResponse<Question[]>>(apiConstants.quesiton.deleteQuestions(formId, questionId));
            if (!response?.data?.success) {
                showError(response.data.message || deleteErrorMessage('question'));
                set({ questions: previousQuestions });
                return;
            }
        }
        catch (err: unknown) {
            console.log('Err While deleting Question :>> ', err);
            showError(createErrorMessage('question(s)'));
            set({ questions: previousQuestions });
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },
    // #endregion

    // #region Flow methods
    addEdge: async (connection: Edge) => {

    },
    updateEdge: async (edgeId: string, edge: Partial<Edge>) => {

    },
    removeEdge: async (connectionId: string) => {

    },
    // #endregion

    // #region State Methods
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

    // setIsSaving: (loading: boolean) => {
    //     set({ isSaving: loading });
    // },
    // #endregion
}))

const prepareNewQuestionObject = (formId: string, type: QuestionType, exeLen: number, index: number): Partial<Question> => {
    const baseObject: Partial<Question> = {
        type,
        title: `New ${type.replace('_', ' ').toLocaleLowerCase()} question (Click to edit)`,
        placeholder: `Enter your answer`,
        description: '',
        formId,
        required: false,
        posX: (exeLen + index) * 400,
        posY: 200
    };
    const options: Partial<QuestionOption>[] = [];
    const metadata: IQuestionMetadata = {}

    switch (type) {
        case QuestionType.USER_DETAIL:
            metadata.detailBtnText = 'Continue'
            break;

        case QuestionType.USER_ADDRESS:
            metadata.address = true;
            metadata.address2 = true;
            metadata.city = true;
            metadata.state = true;
            metadata.country = true;
            metadata.zip = true;
            metadata.postalCode = true;
            break;

        case QuestionType.FILE_ANY:
            metadata.anyFileType = true;
            break;

        case QuestionType.FILE_IMAGE_OR_VIDEO:
            metadata.anyFileType = false;
            metadata.allowedFileTypes = ['image', 'video'];
            break;

        case QuestionType.CHOICE_SINGLE:
        case QuestionType.CHOICE_MULTIPLE:
        case QuestionType.CHOICE_CHECKBOX:
        case QuestionType.CHOICE_DROPDOWN:
            options.push({ label: 'Option 1', value: 'option-1', sortOrder: 0 })
            options.push({ label: 'Option 2', value: 'option-2', sortOrder: 1 })
            metadata.randomize = false;
            break;

        case QuestionType.CHOICE_BOOL:
            options.push({ label: 'Yes', value: '1', sortOrder: 0 })
            options.push({ label: 'No', value: '0', sortOrder: 1 })
            metadata.randomize = false;
            break;

        case QuestionType.INFO_PHONE:
            metadata.allowAnyCountry = true
            break;

        case QuestionType.RATING_STAR:
            metadata.starCount = 5
            break;

        default:
            break;
    }

    return baseObject;
};
