'use client'

import { apiConstants } from '@/constants/api.constants';
import { createErrorMessage, deleteErrorMessage, updateErrorMessage } from '@/constants/messages';
import { eViewMode, eViewScreenMode } from '@/enums/form';
import { Edge, Form, FormStatus, FormType, QuestionOption, QuestionType } from '@prisma/client';
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
    selectedEdgeId: string | null;
    selectedEdge: Edge | null;
    viewMode: eViewMode,
    viewScreenMode: eViewScreenMode;

    savingCount: number;
    isLoading: boolean;

    // Core methods
    initForm: (form: Form, questions: Question[], edges: Edge[]) => void;
    changeStatus: (status: FormStatus) => Promise<boolean>;
    // updateForm: (form: Partial<Form>) => Promise<void>;

    // Question methods
    createQuestions: (questions: QuestionType[]) => Promise<boolean>;
    updateQuestion: (questionId: string, question: Partial<Question>) => Promise<boolean>;
    changePosition: (questionId: string, position: { x: number, y: number }) => Promise<boolean>;
    deleteQuestion: (questionId: string) => Promise<void>;

    // Flow methods
    addEdge: (sourceId: string, targetId: string) => Promise<void>;
    updateEdge: (edgeId: string, edge: Partial<Edge>) => Promise<void>;
    removeEdge: (edgeId: string) => Promise<void>;

    // State Methods
    setIsLoading: (loading: boolean) => void;
    // addSavingCount: () => void;
    // removeSavingCount: () => void;
    setViewMode: (mode: eViewMode) => void;
    setViewScreenMode: (mode: eViewScreenMode) => void;
    setSelectedQuestionId: (id: string | null) => void;
    setSelectedEdgeId: (id: string | null) => void;
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
    selectedEdgeId: null,
    selectedEdge: null,
    dataSource: defaultFormSettings,
    connections: [],
    viewMode: eViewMode.Builder,
    viewScreenMode: eViewScreenMode.Desktop,


    // #region Core methods
    initForm: (form: Form, questions: Question[], edges: Edge[]) => {
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

        if (edges.length) {
            formData.edges = edges;
            formData.selectedEdgeId = edges[0].id;
            formData.selectedEdge = edges[0];
        } else {
            formData.edges = [];
            formData.selectedEdgeId = null;
            formData.selectedEdge = null;
        }

        set({ ...formData });
    },

    changeStatus: async (status: FormStatus) => {
        const { formId } = get();

        if (!formId) {
            console.log("changeArchiveStatus :: FORM ID NOT FOUND!!")
            return false
        }

        try {
            set((state) => ({ savingCount: state.savingCount + 1 }))
            const response = await api.post<ActionResponse<Form>>(apiConstants.form.changeStatus(formId), {
                action: status
            });
            if (!response?.data?.success) {
                showError(response.data.message || updateErrorMessage('form'));
                return false;
            }
            set({
                dataSource: response.data.data,
            })
            return true;
        }
        catch (err: unknown) {
            console.log('Err While changing Status :>> ', err);
            showError("Failed to Change form status");
            return false;
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
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
        const largestSortOrder = questions.reduce((max, ques) => ques.sortOrder && ques.sortOrder > max ? ques.sortOrder : max, 0);
        newQuestionTypes.forEach((queType, ind) => {
            _newQues.push(prepareNewQuestionObject(formId, queType, queLen, ind, largestSortOrder + 1 + ind));
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
            return false;
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
                return false;
            }
            return true;
        }
        catch (err: unknown) {
            console.log('Err While updating Question :>> ', err);
            showError(createErrorMessage('question(s)'));
            set({ questions: previousQuestions });
            return false;
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },
    changePosition: async (questionId: string, position: { x: number, y: number }) => {
        const { questions: previousQuestions, formId } = get();

        if (!formId) {
            console.log("updateQuestion :: FORM ID NOT FOUND!!")
            return false;
        }

        const question = previousQuestions.find((q) => q.id === questionId);
        if (!question) {
            console.log("updateQuestion :: QUESTION NOT FOUND!!")
            return false;
        }

        set({
            selectedQuestionId: question.id,
            selectedQuestion: question
        })

        if (question.posX === position.x && question.posY === position.y) {
            return true;
        }

        set((state) => ({
            questions: state.questions.map((q) => {
                if (q?.id !== questionId) return q;

                return { ...q, posX: position.x, posY: position.y }
            }),
            savingCount: state.savingCount + 1,
        }));

        try {
            const response = await api.patch<ActionResponse<Question[]>>(apiConstants.quesiton.updateQuestions(formId, questionId), { posX: position.x, posY: position.y });
            if (!response?.data?.success) {
                showError(response.data.message || updateErrorMessage('question'));
                set({ questions: previousQuestions });
                return false;
            }
            return true;
        }
        catch (err: unknown) {
            console.log('Err While updating Question :>> ', err);
            showError(createErrorMessage('question(s)'));
            set({ questions: previousQuestions });
            return false;
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },

    deleteQuestion: async (questionId: string) => {
        const { questions: previousQuestions, formId, selectedQuestionId } = get();

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
            if (questionId == selectedQuestionId) {
                set({
                    selectedQuestionId: null,
                    selectedQuestion: null
                })
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
    addEdge: async (sourceId: string, targetId: string) => {
        const { edges: previousEdges, formId } = get();

        if (!formId) {
            console.log("createQuestions :: FORM ID NOT FOUND!!")
            return
        }

        try {
            set((state) => ({ savingCount: state.savingCount + 1 }))
            const response = await api.post<ActionResponse<Edge>>(apiConstants.edge.addEdge(formId), { sourceNodeId: sourceId, targetNodeId: targetId });
            if (!response?.data?.success) {
                showError(response.data.message || createErrorMessage('edge'));
                set({ edges: previousEdges });
                return;
            }
            const edge = response.data.data;
            if (edge) {
                set({
                    edges: [...previousEdges, edge],
                    selectedEdge: edge,
                    selectedEdgeId: edge.id,
                })
            }
        } catch (err: unknown) {
            console.log('Err While adding Edge :>> ', err);
            showError(createErrorMessage('edge'));
            set({ edges: previousEdges });
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },
    updateEdge: async (edgeId: string, edge: Partial<Edge>) => {
        const { edges: previousEdges, formId } = get();

        if (!formId) {
            console.log("updateEdge :: FORM ID NOT FOUND!!")
            return
        }

        set({ edges: [...previousEdges] })
        // try {
        //     set((state) => ({ savingCount: state.savingCount + 1 }))
        //     const response = await api.patch<ActionResponse<Edge[]>>(apiConstants.edge.updateEdge(formId, edgeId), edge);
        //     if (!response?.data?.success) {
        //         showError(response.data.message || updateErrorMessage('edge'));
        //         set({ edges: previousEdges });
        //         return;
        //     }
        //     const edge = response.data.data;
        //     set({
        //         edges: [...previousEdges, edge],
        //         selectedEdge: edge,
        //         selectedEdgeId: edge.id,
        //     })
        // } catch (err: unknown) {
        //     console.log('Err While updating Edge :>> ', err);
        //     showError(updateErrorMessage('edge'));
        //     set({ edges: previousEdges });
        // }
        // finally {
        //     set((state) => ({ savingCount: state.savingCount - 1 }))
        // }
    },
    removeEdge: async (connectionId: string) => {

    },

    setSelectedEdgeId: (id: string | null) => {
        const { edges } = get();
        const edge = edges.find(e => e.id === id) || null;
        set({
            selectedEdgeId: edge ? id : null,
            selectedEdge: edge
        });
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
    // #endregion
}))

const prepareNewQuestionObject = (formId: string, type: QuestionType, exeLen: number, index: number, sortOrder: number): Partial<Question> => {
    const baseObject: Partial<Question> = {
        type,
        title: `New ${type.replace('_', ' ').toLocaleLowerCase()} question (Click to edit)`,
        placeholder: `Enter your answer`,
        description: '',
        formId,
        required: false,
        posX: (exeLen + index) * 400,
        posY: 200,
        sortOrder
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
