// Use relative paths for API requests which will be handled by the proxy
const DISCORD_API_BASE = '/discord-api';
const BOT_ID = import.meta.env.VITE_DISCORD_BOT_ID;

// Utility function to sanitize error messages
const sanitizeError = (error) => {
  // Remove sensitive information from error messages
  const sanitizedMessage = error.message.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, '[EMAIL]')
    .replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP]')
    .replace(/Bearer [a-zA-Z0-9\-._~+/]+=*/g, '[TOKEN]');
  return new Error(sanitizedMessage);
};

// Add error handling and rate limiting
const rateLimitDelay = (retryAfter = 1000) => new Promise(resolve => setTimeout(resolve, retryAfter));

// Utility function to handle API responses
const handleApiResponse = async (response) => {
  if (response.status === 429) { // Rate limited
    const retryAfter = response.headers.get('Retry-After') * 1000;
    await rateLimitDelay(retryAfter);
    throw new Error('Rate limited, please try again');
  }
  
  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status}`);
  }
  
  return response.json();
};

// Add secure headers to requests
const getSecureHeaders = () => ({
  'Authorization': `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`,
  'Content-Type': 'application/json',
  'X-RateLimit-Precision': 'millisecond'
});

// Check if bot is in a server
export const checkBotPresence = async (serverId) => {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${serverId}/members/${BOT_ID}`, {
      headers: getSecureHeaders(),
      credentials: 'include'
    });
    
    if (response.status === 200) {
      return true;
    } else if (response.status === 404) {
      return false;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error checking bot presence:', sanitizeError(error));
    return false;
  }
};

// Export utility functions with error sanitization
export const discordApi = {
  async get(endpoint) {
    try {
      const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
        headers: getSecureHeaders(),
        credentials: 'include'
      });
      return handleApiResponse(response);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  
  async post(endpoint, data) {
    try {
      const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
        method: 'POST',
        headers: getSecureHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });
      return handleApiResponse(response);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  
  async put(endpoint, data) {
    try {
      const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: getSecureHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });
      return handleApiResponse(response);
    } catch (error) {
      throw sanitizeError(error);
    }
  },
  
  async delete(endpoint) {
    try {
      const response = await fetch(`${DISCORD_API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers: getSecureHeaders(),
        credentials: 'include'
      });
      return handleApiResponse(response);
    } catch (error) {
      throw sanitizeError(error);
    }
  }
};
