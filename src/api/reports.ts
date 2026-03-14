import apiService from './index';

// Interfaces for reports API
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    recently_active: number;
  };
  questionnaires: {
    completed: number;
  };
  appointments: {
    pending: number;
  };
  lab_results: {
    total: number;
  };
  recommendations: {
    active: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export interface UserActivity {
  date: string;
  registrations: number;
  logins: number;
}

export interface QuestionnaireCompletionRate {
  questionnaire_id: number;
  title: string;
  total_assigned: number;
  completed: number;
  completion_rate: number;
}

export interface LabResultOverTime {
  id: number;
  user_id: number;
  test_name: string;
  test_date: string;
  values: Record<string, any>;
}

export interface ReportOptions {
  report_type: 'user_data' | 'questionnaires' | 'lab_results';
  format: 'excel' | 'csv' | 'pdf';
  date_from?: string;
  date_to?: string;
}

// Get admin dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return await apiService.get('/admin/reports/dashboard-stats');
};

// Get user activity over time
export const getUserActivity = async (
  period: 'week' | 'month' | 'year' = 'month',
  date_from?: string,
  date_to?: string
): Promise<UserActivity[]> => {
  const params = {
    period,
    date_from,
    date_to
  };
  return await apiService.get('/admin/reports/user-activity', { params });
};

// Get questionnaire completion rates
export const getQuestionnaireCompletionRates = async (): Promise<QuestionnaireCompletionRate[]> => {
  return await apiService.get('/admin/reports/questionnaire-completion');
};

// Get lab results over time
export const getLabResultsOverTime = async (
  test_name?: string,
  date_from?: string,
  date_to?: string
): Promise<LabResultOverTime[]> => {
  const params = {
    test_name,
    date_from,
    date_to
  };
  return await apiService.get('/admin/reports/lab-results-over-time', { params });
};

// Generate a downloadable report
export const generateReport = async (options: ReportOptions): Promise<Blob> => {
  const response = await apiService.post('/admin/reports/generate', options, {
    responseType: 'blob'
  });
  
  return response;
}; 