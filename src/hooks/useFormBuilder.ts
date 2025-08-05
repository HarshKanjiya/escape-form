import { updateFormData } from '@/actions/form';
import { Form, FormUpdate } from '@/types/db';
import { Question, WorkflowConnection, ViewMode, WorkflowDirection } from '@/types/form';
import { useState, useCallback } from 'react';

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [workflowDirection, setWorkflowDirection] = useState<WorkflowDirection>('horizontal');
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [dataSource, setDataSource] = useState<FormUpdate | Form>(initialFormData);

  const addQuestion = useCallback((type: Question['type']) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      title: `New ${type.replace('-', ' ')} question`,
      required: false,
      position: { x: 100, y: 100 },
      options: type === 'multiple-choice' || type === 'checkbox' || type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined,
    };
    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
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

  const addConnection = useCallback((connection: Omit<WorkflowConnection, 'id'>) => {
    setConnections(prev => [...prev, { ...connection, id: `connection-${Date.now()}` }]);
  }, []);

  const removeConnection = useCallback((id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  }, []);

  const selectedQuestion = selectedQuestionId ? questions.find(q => q.id === selectedQuestionId) : null;

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