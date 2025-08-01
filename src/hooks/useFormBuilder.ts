import { Question, FormSettings, WorkflowConnection, ViewMode, WorkflowDirection } from '@/types/form';
import { useState, useCallback } from 'react';


const defaultFormSettings: FormSettings = {
  name: 'Untitled Form',
  icon: 'FileText',
  description: 'A new form created with FormBuilder',
  customDomain: '',
  theme: 'light',
  colorPalette: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    text: '#1F2937',
  },
  isPublic: true,
  welcomeScreen: {
    enabled: true,
    title: 'Welcome to our form',
    description: 'Thank you for taking the time to fill out this form.',
    buttonText: 'Start',
  },
  thankYouScreen: {
    enabled: true,
    title: 'Thank you!',
    description: 'Your response has been recorded.',
  },
  timing: {
    enabled: false,
    openTime: '',
    closeTime: '',
  },
  anonymous: false,
  consentRequired: false,
  multipleSubmissions: true,
};

export const useFormBuilder = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [formSettings, setFormSettings] = useState<FormSettings>(defaultFormSettings);
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [workflowDirection, setWorkflowDirection] = useState<WorkflowDirection>('horizontal');
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);

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

  const updateFormSettings = useCallback((updates: Partial<FormSettings>) => {
    setFormSettings(prev => ({ ...prev, ...updates }));
  }, []);

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
    formSettings,
    viewMode,
    workflowDirection,
    connections,
    setSelectedQuestionId,
    setViewMode,
    setWorkflowDirection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    updateFormSettings,
    addConnection,
    removeConnection,
  };
};