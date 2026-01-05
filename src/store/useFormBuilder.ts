'use client'

import { apiConstants } from '@/constants/api.constants';
import { createErrorMessage, deleteErrorMessage, updateErrorMessage } from '@/constants/messages';
import { eViewMode, eViewScreenMode } from '@/enums/form';
import { Edge, Form, FormStatus, QuestionOption, QuestionType } from '@prisma/client';
import api from '@/lib/axios';
import { showError, generateUUID } from '@/lib/utils';
import { ActionResponse } from '@/types/common';
import { IQuestionMetadata, Question } from '@/types/form';
import { create } from 'zustand';

// Local storage key for tryout mode
const TRYOUT_STORAGE_KEY = 'formBuilder_tryout';

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
    shouldSave: boolean;

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
    initTryoutMode: () => void;
    setShouldSave: (shouldSave: boolean) => void;
    changeStatus: (status: FormStatus) => Promise<boolean>;
    // updateForm: (form: Partial<Form>) => Promise<void>;

    // Question methods
    createQuestions: (questions: QuestionType[]) => Promise<boolean>;
    updateQuestion: (questionId: string, question: Partial<Question>) => Promise<boolean>;
    changePosition: (questionId: string, position: { x: number, y: number }) => Promise<boolean>;
    deleteQuestion: (questionId: string) => Promise<void>;

    getQuestionOptions: (questionId: string) => Promise<QuestionOption[]>;
    saveQuestionOption: (option: Partial<QuestionOption>) => Promise<boolean>;
    deleteQuestionOption: (optionId: string) => Promise<boolean>;

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
    shouldSave: true,

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

    initTryoutMode: () => {
        const tryoutFormId = generateUUID();
        const tryoutForm: Partial<Form> = {
            ...defaultFormSettings,
            id: tryoutFormId,
            name: 'Tryout Form',
            description: 'This is a tryout form - data will not be saved',
            projectId: generateUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set({
            formId: tryoutFormId,
            dataSource: tryoutForm,
            questions: [],
            edges: [],
            selectedQuestionId: null,
            selectedQuestion: null,
            selectedEdgeId: null,
            selectedEdge: null,
            shouldSave: false,
        });

        // Save to local storage
        if (typeof window !== 'undefined') {
            localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                form: tryoutForm,
                questions: [],
                edges: []
            }));
        }
    },

    setShouldSave: (shouldSave: boolean) => {
        set({ shouldSave });
    },

    changeStatus: async (status: FormStatus) => {
        const { formId, shouldSave, dataSource, questions, edges } = get();

        if (!formId) {
            console.log("changeArchiveStatus :: FORM ID NOT FOUND!!")
            return false
        }

        // If not saving (tryout mode), just update local state
        if (!shouldSave) {
            const updatedForm = { ...dataSource, status };
            set({ dataSource: updatedForm });
            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: updatedForm,
                    questions,
                    edges
                }));
            }
            return true;
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
        const { questions, formId, shouldSave, dataSource, edges } = get();

        if (!formId) {
            console.log("createQuestions :: FORM ID NOT FOUND!!")
            return false
        }

        const queLen = questions?.length || 0;

        const _newQues: Partial<Question>[] = [];
        const largestSortOrder = questions?.length ? questions.reduce((max, ques) => ques.sortOrder && ques.sortOrder > max ? ques.sortOrder : max, 0) : 0;
        newQuestionTypes.forEach((queType, ind) => {
            _newQues.push(prepareNewQuestionObject(formId, queType, queLen, ind, largestSortOrder + 1 + ind));
        })

        // If not saving (tryout mode), create local questions with generated IDs
        if (!shouldSave) {
            const localQues: Question[] = _newQues.map((q) => ({
                ...q,
                id: generateUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Question));

            const updatedQuestions = [...questions, ...localQues];
            set({
                questions: updatedQuestions,
                selectedQuestion: localQues[localQues.length - 1],
                selectedQuestionId: localQues[localQues.length - 1].id,
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions: updatedQuestions,
                    edges
                }));
            }
            return true;
        }

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
        const { questions: previousQuestions, formId, shouldSave, dataSource, edges } = get();

        if (!formId) {
            console.log("updateQuestion :: FORM ID NOT FOUND!!")
            return false;
        }

        const updatedQuestions = previousQuestions.map((q) => {
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
        });

        set({
            questions: updatedQuestions,
            savingCount: shouldSave ? 1 : 0,
        });

        // If not saving (tryout mode), just update local storage
        if (!shouldSave) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions: updatedQuestions,
                    edges
                }));
            }
            return true;
        }

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
        const { questions: previousQuestions, formId, shouldSave, dataSource, edges } = get();

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

        const updatedQuestions = previousQuestions.map((q) => {
            if (q?.id !== questionId) return q;
            return { ...q, posX: position.x, posY: position.y }
        });

        set({
            questions: updatedQuestions,
            savingCount: shouldSave ? 1 : 0,
        });

        // If not saving (tryout mode), just update local storage
        if (!shouldSave) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions: updatedQuestions,
                    edges
                }));
            }
            return true;
        }

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
        const { questions: previousQuestions, formId, selectedQuestionId, shouldSave, dataSource, edges } = get();

        if (!formId) {
            console.log("updateQuestion :: FORM ID NOT FOUND!!")
            return;
        }

        const updatedQuestions = previousQuestions.filter((q) => q?.id !== questionId);

        set({
            questions: updatedQuestions,
            savingCount: shouldSave ? 1 : 0,
        });

        // If not saving (tryout mode), just update local storage
        if (!shouldSave) {
            if (questionId == selectedQuestionId) {
                set({
                    selectedQuestionId: null,
                    selectedQuestion: null
                })
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions: updatedQuestions,
                    edges
                }));
            }
            return;
        }

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

    getQuestionOptions: async (questionId: string) => {
        const { formId, shouldSave, questions } = get();

        if (!formId) {
            console.log("getQuestionOptions :: FORM ID NOT FOUND!!")
            return [];
        }

        // If not saving (tryout mode), return options from local state
        if (!shouldSave) {
            const question = questions.find(q => q.id === questionId);
            return question?.options || [];
        }

        try {
            console.log('[GET OPTIONS] Fetching options for question:', questionId);
            const response = await api.get<ActionResponse<QuestionOption[]>>(
                apiConstants.option.getOptions(formId, questionId)
            );

            if (!response?.data?.success) {
                showError(response.data.message || 'Failed to fetch options');
                return [];
            }

            const options = response.data.data || [];
            console.log('[GET OPTIONS] Fetched options:', options);

            // Update local state with fetched options
            set((state) => ({
                questions: state.questions.map((q) =>
                    q.id === questionId ? { ...q, options } as Question : q
                ),
            }));

            return options;
        }
        catch (err: unknown) {
            console.log('Err While fetching options :>> ', err);
            showError('Failed to fetch options');
            return [];
        }
    },

    saveQuestionOption: async (option: Partial<QuestionOption>) => {
        const { formId, questions, shouldSave, dataSource, edges } = get();

        if (!formId) {
            console.log("saveQuestionOption :: FORM ID NOT FOUND!!")
            return false;
        }

        if (!option.questionId) {
            console.log("saveQuestionOption :: QUESTION ID NOT FOUND!!")
            return false;
        }

        // If not saving (tryout mode), just update local state
        if (!shouldSave) {
            const savedOption: QuestionOption = {
                ...option,
                id: option.id || generateUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
            } as QuestionOption;

            const updatedQuestions = questions.map((q) => {
                if (q.id !== option.questionId) return q;

                const updatedOptions = option.id
                    ? (q.options?.map(opt => opt.id === option.id ? savedOption : opt) || [])
                    : [...(q.options || []), savedOption];

                return { ...q, options: updatedOptions } as Question;
            });

            set({ questions: updatedQuestions });

            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions: updatedQuestions,
                    edges
                }));
            }
            return true;
        }

        try {
            set((state) => ({ savingCount: state.savingCount + 1 }))

            const response = await api.post<ActionResponse<QuestionOption>>(
                apiConstants.option.saveOption(formId, option.questionId),
                option
            );

            if (!response?.data?.success) {
                showError(response.data.message || (option.id ? 'Failed to update option' : 'Failed to create option'));
                return false;
            }

            const savedOption = response.data.data;

            // Update local state with the saved option
            set((state) => ({
                questions: state.questions.map((q) => {
                    if (q.id !== option.questionId) return q;

                    const updatedOptions = option.id
                        ? (q.options?.map(opt => opt.id === option.id ? savedOption : opt) || [])
                        : [...(q.options || []), savedOption];

                    return { ...q, options: updatedOptions } as Question;
                }),
            }));

            console.log('[API] Option saved successfully:', savedOption);
            return true;
        }
        catch (err: unknown) {
            console.log('Err While saving option :>> ', err);
            showError(option.id ? 'Failed to update option' : 'Failed to create option');
            return false;
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },

    deleteQuestionOption: async (optionId: string) => {
        const { formId, questions, shouldSave, dataSource, edges } = get();

        if (!formId) {
            console.log("deleteQuestionOption :: FORM ID NOT FOUND!!")
            return false;
        }

        // Find the question that contains this option
        const question = questions.find(q => q.options?.some(opt => opt.id === optionId));
        if (!question) {
            console.log("deleteQuestionOption :: QUESTION NOT FOUND for option ID", optionId)
            return false;
        }

        const previousQuestions = [...questions];

        // Optimistically update UI
        const updatedQuestions = questions.map((q) => {
            if (q.id !== question.id) return q;
            return {
                ...q,
                options: q.options?.filter(opt => opt.id !== optionId) || []
            };
        });

        set({ questions: updatedQuestions });

        // If not saving (tryout mode), just update local storage
        if (!shouldSave) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions: updatedQuestions,
                    edges
                }));
            }
            return true;
        }

        try {
            set((state) => ({ savingCount: state.savingCount + 1 }))

            const response = await api.delete<ActionResponse<QuestionOption>>(
                apiConstants.option.deleteOption(formId, question.id, optionId)
            );

            if (!response?.data?.success) {
                showError(response.data.message || deleteErrorMessage('option'));
                set({ questions: previousQuestions });
                return false;
            }

            console.log('[API] Option deleted successfully:', optionId);
            return true;
        }
        catch (err: unknown) {
            console.log('Err While deleting option :>> ', err);
            showError(deleteErrorMessage('option'));
            set({ questions: previousQuestions });
            return false;
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
    },
    // #endregion

    // #region Flow methods
    addEdge: async (sourceId: string, targetId: string) => {
        const { edges: previousEdges, formId, shouldSave, dataSource, questions } = get();

        if (!formId) {
            console.log("createQuestions :: FORM ID NOT FOUND!!")
            return
        }

        // If not saving (tryout mode), create local edge with generated ID
        if (!shouldSave) {
            const localEdge: Edge = {
                id: generateUUID(),
                formId,
                sourceNodeId: sourceId,
                targetNodeId: targetId,
                condition: {},
            };

            const updatedEdges = [...previousEdges, localEdge];
            set({
                edges: updatedEdges,
                selectedEdge: localEdge,
                selectedEdgeId: localEdge.id,
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions,
                    edges: updatedEdges
                }));
            }
            return;
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
        const { edges: previousEdges, formId, selectedEdgeId, shouldSave, dataSource, questions } = get();

        if (!formId) {
            console.log("removeEdge :: FORM ID NOT FOUND!!")
            return
        }

        const updatedEdges = previousEdges.filter((e) => e?.id !== connectionId);

        set({
            edges: updatedEdges,
            savingCount: shouldSave ? 1 : 0,
        });

        // If not saving (tryout mode), just update local storage
        if (!shouldSave) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(TRYOUT_STORAGE_KEY, JSON.stringify({
                    form: dataSource,
                    questions,
                    edges: updatedEdges
                }));
            }
            return;
        }

        try {
            const response = await api.delete<ActionResponse<Edge>>(apiConstants.edge.deleteEdge(formId, connectionId));
            if (!response?.data?.success) {
                showError(response.data.message || deleteErrorMessage('edge'));
                set({ edges: previousEdges });
                return;
            }
        } catch (err: unknown) {
            console.log('Err While deleting Edge :>> ', err);
            showError(deleteErrorMessage('edge'));
            set({ edges: previousEdges });
        }
        finally {
            set((state) => ({ savingCount: state.savingCount - 1 }))
        }
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