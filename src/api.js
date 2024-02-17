export const Api = {
  api() {
    // const baseURL = 'https://api.app.trollana.io/v1';
    const baseURL = 'http://localhost:8080/v1';

    async function fetchWithTimeout(resource, options = {}, timeout = 8000) {
      console.log('fetchWithTimeout', resource);
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    }

    async function request(endpoint, options = {}) {
      console.log('request', endpoint);
      const response = await fetchWithTimeout(`${baseURL}${endpoint}`, options);
      const data = await response.json();

      console.log('response', response);
      console.log('data', data);
      if (!response.ok) {
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }

      return data;
    }

    return {
      get(endpoint, options) {
        return request(endpoint, { ...options, method: 'GET' });
      },
      post(endpoint, body, options) {
        return request(endpoint, {
          ...options,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      },
      // Add other methods (PUT, DELETE, etc.) as needed
    };
  },
};

export default Api;
