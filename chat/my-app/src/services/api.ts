const API_BASE_URL = "http://127.0.0.1:8000";

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Helper function for API calls with authentication
const apiCall = async (endpoint: string, method: string = "GET", data?: unknown) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.msg || error.detail || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


// Chat API calls
export const  chatAPI = {
  createChat: (payload: { name: string; number: string }) =>
    apiCall("/api/save/", "POST", payload),
  
  getChats: () =>
    apiCall("/api/contacts/", "GET"),
};

// Group API calls
export const groupAPI = {
  createGroup: (payload: { name: string; members: Array<{ name: string; number: string }> }) =>
    apiCall("/api/groups/", "POST", payload),
  
  getGroups: () =>
    apiCall("/api/groups/list/", "GET"),

  addMember: (groupId: number, payload: { name: string; number: string }) =>
    apiCall(`/api/groups/${groupId}/add-member/`, "POST", payload),

  removeMember: (groupId: number, memberId: number) =>
    apiCall(`/api/groups/${groupId}/remove-member/${memberId}/`, "DELETE"),

  getMembers: (groupId: number) =>
    apiCall(`/api/groups/${groupId}/members/`, "GET"),
};

// Auth API calls
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall("/api/auth/login/", "POST", { username, password }),
  
  logout: () =>
    apiCall("/api/auth/logout/", "POST"),
};

// Message API calls
export const messageAPI = {
  getMessages: async (conversationId: string) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/messages/${conversationId}/`, { headers });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || err.detail || "Failed to fetch messages");
    }

    return res.json();
  },

  saveMessage: (payload: {
    conversation_id: string;
    sender_id: string;
    text?: string;
  }) =>
    apiCall("/api/messages/", "POST", payload),
};
