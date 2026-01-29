import config from '@/config.json';

export const ApiUrl = config.VUE_APP_API_BASE_URL;
export const BaseApiUrl = config.API_BASE_URL;

export const ApiUrlUsers = `${ApiUrl}/user`;
export const ApiUrlAssos = `${ApiUrl}/association`;
export const ApiUrlMembres = `${ApiUrl}/membre`;
export const ApiUrlTresories = `${ApiUrl}/tresorerie`;
export const ApiUrlEvents = `${ApiUrl}/events`;
export const ApiUrlBudgets = `${ApiUrl}/budgets`;
export const ApiUrlActions = `${ApiUrl}/actions`;
export const ApiUrlDocuments = `${ApiUrl}/documents`;

export const BaseApiUrlMe = `${BaseApiUrl}/api/me`;
export const BaseApiUrlAuth = `${BaseApiUrl}/api/auth`;
export const BaseApiUrlA_Is = `${BaseApiUrl}/api/a_is`;
export const BaseApiUrlAssociations = `${BaseApiUrl}/api/associations`;
export const BaseApiUrlAssociationsUser = `${BaseApiUrl}/api/association_users`;
export const BaseApiUrlBudget = `${BaseApiUrl}/api/budgets`;
export const BaseApiUrlDocument = `${BaseApiUrl}/api/documents`;
export const BaseApiUrlDocumentType = `${BaseApiUrl}/api/document_types`;
export const BaseApiUrlEvent = `${BaseApiUrl}/api/events`;
export const BaseApiUrlEventType = `${BaseApiUrl}/api/event_types`;
export const BaseApiUrlLine = `${BaseApiUrl}/api/lines`;
export const BaseApiUrlRole = `${BaseApiUrl}/api/roles`;
export const BaseApiUrlTask = `${BaseApiUrl}/api/tasks`;
export const BaseApiUrlTransactions = `${BaseApiUrl}/api/transactions`;
export const BaseApiUrlTransactionType = `${BaseApiUrl}/api/transaction_types`;
export const BaseApiUrlUser = `${BaseApiUrl}/api/users`;