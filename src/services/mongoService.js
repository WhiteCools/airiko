// Use relative path for API requests which will be handled by the proxy
const API_BASE = '/api';

// Setup Collection Functions
export async function getSetupInfo(serverId) {
  try {
    const response = await fetch(`${API_BASE}/setup/${serverId}`, {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching setup info:', error.message);
    throw error;
  }
}

// QA Collection Functions
export async function getQAList(serverId) {
  try {
    const response = await fetch(`${API_BASE}/qa/${serverId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching QA list:', error.message);
    throw error;
  }
}

export async function addQA(serverId, question, answer) {
  try {
    const response = await fetch(`${API_BASE}/qa/${serverId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding QA:', error.message);
    throw error;
  }
}

export async function updateQA(serverId, qaId, question, answer) {
  try {
    const response = await fetch(`${API_BASE}/qa/${serverId}/${qaId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating QA:', error.message);
    throw error;
  }
}

export async function deleteQA(serverId, qaId) {
  try {
    const response = await fetch(`${API_BASE}/qa/${serverId}/${qaId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting QA:', error.message);
    throw error;
  }
}
