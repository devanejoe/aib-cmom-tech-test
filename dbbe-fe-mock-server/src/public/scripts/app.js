import { startConfetti, stopConfetti } from './confetti.js';
import { BASE_ENDPOINT, SELECTORS, URL } from './constants.js';
import { fetchAvailableOptions, fetchEndpoints, fetchServicesList } from './fetch.js';
import { clearElement, createDropdown } from './utils.js';

const savePreferences = async (payload) => {
  const methodSelect = document.querySelector('#method');
  const statusSelect = document.querySelector('#status');

  if (!methodSelect.value || !statusSelect.value) {
    alert('Can\'t save empty preference');
    return;
  }

  if (!payload) {
    alert('No endpoint selected');
    return;
  }
  
  const formData = {
    endpointId: payload.id,
    method: methodSelect.value,
    status: statusSelect.value,
  };

  const response = await fetch(`${BASE_ENDPOINT}${URL.PREFERENCES}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-type': 'application/json'
    },
  });

  const data = await response.json();
  
  if (data.successful) {
    startConfetti();
    setTimeout(stopConfetti, 2000);
  } else {
    alert('Something went wrong while saving preference');
  }
};

const createSavedPreferencesTable = (endpoint) => {
  const table = document.createElement('table');
  const tHead = document.createElement('thead');
  const tBody = document.createElement('tbody');
  const firstTH = document.createElement('th');
  const secondTH = document.createElement('th');

  firstTH.textContent = 'Method';
  secondTH.textContent = 'Status';

  tHead.appendChild(firstTH);
  tHead.appendChild(secondTH);

  if (!Object.keys(endpoint.savedPreferences).length) {
    const noPreference = document.createElement('p');
    noPreference.textContent = 'No Saved Preferences';
    return noPreference;
  }

  Object.keys(endpoint.savedPreferences)
    .forEach(key => {
      const tr = document.createElement('tr');
      const methodTd = document.createElement('td');
      const statusTd = document.createElement('td');

      methodTd.textContent = key;
      statusTd.textContent = endpoint.savedPreferences[key];

      tr.appendChild(methodTd);
      tr.appendChild(statusTd);

      tBody.appendChild(tr);	
    });

  table.appendChild(tHead);
  table.appendChild(tBody);

  return table;
};

const createUpdatePreferenceContainer = (container, availableOptions) => {
  const methodSelect = createDropdown(availableOptions.method, 'method');
  const statusSelect = createDropdown(availableOptions.status, 'status');

  container.appendChild(methodSelect);
  container.appendChild(statusSelect);

  const btn = document.createElement('button');
  btn.textContent = 'Save';

  btn.addEventListener('click', () => {
    savePreferences(
      JSON.parse(window.sessionStorage.getItem('activeEndpoint'))
    );
  });

  container.appendChild(btn);
};

const createSavedPreferencesContainer = (endpoint) => {
  const para = document.createElement('p');
  para.textContent = endpoint.title;

  SELECTORS.PREFERENCES.appendChild(para);
  SELECTORS.PREFERENCES.appendChild(createSavedPreferencesTable(endpoint));
};

const createEndpointsList = async (item) => {
  const endpoints = await fetchEndpoints(item.id);

  clearElement(SELECTORS.ENDPOINTS_LIST);
  clearElement(SELECTORS.PREFERENCES);
  window.sessionStorage.removeItem('activeEndpoint');

  endpoints.forEach(endpoint => {
    const btn = document.createElement('button');
    btn.textContent = endpoint.title;
    SELECTORS.ENDPOINTS_LIST.appendChild(btn);

    btn.addEventListener('click', () => {
      window.sessionStorage.setItem('activeEndpoint', JSON.stringify(endpoint));
      clearElement(SELECTORS.PREFERENCES);
      createSavedPreferencesContainer(endpoint);
    });
  });
};

const createServiceList = (container, list) => {
  list.forEach(service => {
    const btn = document.createElement('button');
    btn.textContent = service.title;
    container.appendChild(btn);
    btn.addEventListener('click', () => {
      createEndpointsList(service);
    });
  });
};

const main = async () => {
  window.sessionStorage.removeItem('activeEndpoint');
  const servicesList = await fetchServicesList();
  const availableOptions = await fetchAvailableOptions();
  createServiceList(SELECTORS.SERVICE_LIST, servicesList);
  createUpdatePreferenceContainer(SELECTORS.UPDATE_PREFERENCE, availableOptions);
};

window.onload = main;
