const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const propertyService = {
  // Create new property
  async createProperty(propertyData, token = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add token if provided (for JWT)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers,
      credentials: 'include', // For cookie-based authentication
      body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create property');
    }

    return response.json();
  },

  // Update property
  async updateProperty(id, propertyData, token = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update property');
    }

    return response.json();
  },

  // Get single property
  async getProperty(id, token = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/properties/${id}`, {
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch property');
    }

    return response.json();
  },

  // Upload images
  async uploadImages(images, token = null) {
    const formData = new FormData();
    
    images.forEach((image, index) => {
      if (image.file) {
        formData.append('images', image.file);
      }
    });

    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/properties/upload-images`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload images');
    }

    return response.json();
  },

  // Get all properties with filters
  async getAllProperties(filters = {}, token = null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}/properties?${queryString}` : `${API_URL}/properties`;

    const response = await fetch(url, {
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch properties');
    }

    return response.json();
  }
};