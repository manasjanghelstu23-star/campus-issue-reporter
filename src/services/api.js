import { BASE_URL, USE_MOCK_API } from './apiConfig';
import { mockIssues } from './mockData';

// Helper wrapper for native fetch API to standardise backend calls
const fetchPlatform = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header here later when using tokens
        // 'Authorization': `Bearer ${token}`
      },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.warn(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// ------------------------------------
// ISSUES ENDPOINTS
// ------------------------------------

export const getAdminIssues = async () => {
  if (USE_MOCK_API) {
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(mockIssues), 500));
  }
  return fetchPlatform('/admin/issues');
};

export const getIssueById = async (id) => {
  if (USE_MOCK_API) {
    const issue = mockIssues.find(i => i.id === String(id));
    return new Promise(resolve => setTimeout(() => resolve(issue), 500));
  }
  return fetchPlatform(`/issues/${id}`);
};

export const updateIssueStatus = async (id, status, remarks) => {
  if (USE_MOCK_API) {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  }
  return fetchPlatform(`/admin/issues/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, remarks }),
  });
};

export const createIssue = async (issueData) => {
  if (USE_MOCK_API) {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, id: Date.now() }), 500));
  }
  return fetchPlatform('/issues', {
    method: 'POST',
    body: JSON.stringify(issueData),
  });
};

export const getMyComplaints = async (studentId) => {
  if (USE_MOCK_API) {
    const myIssues = mockIssues.filter(i => i.reporterName.includes(studentId) || true);
    return new Promise(resolve => setTimeout(() => resolve(myIssues), 500));
  }
  return fetchPlatform(`/student/issues/${studentId}`);
};

// ------------------------------------
// AUTH ENDPOINTS
// ------------------------------------

export const loginUser = async (credentials) => {
  if (USE_MOCK_API) {
    return new Promise(resolve => setTimeout(() => resolve({ token: 'mock-token', user: { role: 'student', id: '2918' } }), 500));
  }
  return fetchPlatform('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  if (USE_MOCK_API) {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, user: { id: '2918' } }), 500));
  }
  return fetchPlatform('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};
