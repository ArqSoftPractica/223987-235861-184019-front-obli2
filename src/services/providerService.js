import axios from "./axiosConnection";

export async function getProviders(data, onSuccess = null, onError = null) {
    try{
        const response = await axios.get(`/providers?isActive=true`);
        return response;
    } catch (error) {
        const message = error.response.data.error ?? error.message ?? error;
        onError && onError(message);
    }
}

export async function getProvider(providerId) {
  try{
      const response = await axios.get(`/providers/${providerId}`);
      return response;
  } catch (error) {
      console.log(error);
  }
}

export async function deleteProvider(providerId, onSuccess = null, onError = null) {
  try{
      const response = await axios.delete(`/providers/${providerId}`);
      return response;
  } catch (error) {
      const message = error.response.data.error ?? error.message ?? error;
      onError && onError(message);
  }
}

export async function createProvider(data, onSuccess = null, onError = null) {
  const provider = {
    name: data.name,
    address: data.address,
    email: data.email,
    phone: data.phone
  }

  try {
      const response = await axios.post(`/providers`, provider);
      onSuccess && onSuccess(response);
  } catch (error) {
      const message = error.response.data.error ?? error.message ?? error;
      onError && onError(message);
  }
}

export async function editProvider(data, onSuccess = null, onError = null) {
  const provider = {
    name: data.name,
    address: data.address,
    email: data.email,
    phone: data.phone
  }

  try {
      const response = await axios.put(`/providers/${data.providerId}`, provider);
      onSuccess && onSuccess(response);
  } catch (error) {
      const message = error.response.data.error ?? error.message ?? error;
      onError && onError(message);
  }
}