import { BASE_ENDPOINT, URL } from './constants.js';

export const fetchAvailableOptions = async () => {
  const response = await fetch(`${BASE_ENDPOINT}${URL.AVAILABLE_OPTIONS}`);
  return response.json();
};

export const fetchServicesList = async () => {
  const response = await fetch(`${BASE_ENDPOINT}${URL.SERVICE_LIST}`);
  return response.json();
};

export const fetchEndpoints = async (id) => {
  const response = await fetch(`${BASE_ENDPOINT}${URL.SERVICE_LIST}/${id}${URL.ENDPOINTS_LIST}`);
  return response.json();
};
