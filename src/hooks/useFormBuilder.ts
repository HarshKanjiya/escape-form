import { updateFormData } from '@/actions/form';
import { eQuestionType, eViewMode, eWorkflowDirection } from '@/enums/form';
import { Form, FormUpdate } from '@/types/db';
import { IQuestion, IWorkflowConnection } from '@/types/form';
import { useState, useCallback, useEffect } from 'react';

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

export const useFormBuilder = (initialFormData: FormUpdate = defaultFormSettings) => {

  // form fields
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  // selected question
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // current form view mode
  const [viewMode, setViewMode] = useState<eViewMode>(eViewMode.Builder);

  const [dataSource, setDataSource] = useState<FormUpdate | Form>(initialFormData);

  // TODO
  const [workflowDirection, setWorkflowDirection] = useState<eWorkflowDirection>(eWorkflowDirection.Horizontal);
  const [connections, setConnections] = useState<IWorkflowConnection[]>([]);

  useEffect(() => {
    if (!selectedQuestionId) return;
    const question = questions.find(q => q.id === selectedQuestionId);
    setSelectedQuestion(question || null);
  }, [selectedQuestionId]);

  const addQuestion = useCallback((type: eQuestionType) => {
    const newQuestion: IQuestion = {
      id: `question-${Date.now()}`,
      type,
      title: `New ${type.replace('_', ' ')} question`,
      required: false,
      position: { x: 100, y: 100 },
      options: type === eQuestionType.checkbox || type === eQuestionType.dropdown ? ['Option 1', 'Option 2'] : undefined,
    };
    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<IQuestion>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selectedQuestionId === id) {
      setSelectedQuestionId(null);
    }
  }, [selectedQuestionId]);

  const moveQuestion = useCallback((id: string, position: { x: number; y: number }) => {
    updateQuestion(id, { position });
  }, [updateQuestion]);


  const updateForm = useCallback((updates: Partial<FormUpdate>) => {
    setDataSource(prev => ({ ...prev, ...updates }));
    updateFormData(updates);
  }, [])

  const addConnection = useCallback((connection: Omit<IWorkflowConnection, 'id'>) => {
    setConnections(prev => [...prev, { ...connection, id: `connection-${Date.now()}` }]);
  }, []);

  const removeConnection = useCallback((id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  }, []);

  return {
    questions,
    selectedQuestion,
    selectedQuestionId,
    dataSource,
    viewMode,
    workflowDirection,
    connections,
    setSelectedQuestionId,
    setViewMode,
    setWorkflowDirection,
    setDataSource,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    updateForm,
    addConnection,
    removeConnection,
  };
};