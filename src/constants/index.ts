const projectStatusMap = {
  IN_DEVELOPMENT: "Em Desenvolvimento",
  IN_PRODUCTION: "Em Produção",
  FINISHED: "Finalizado",
};

const roleMap = {
  ADMIN: "Administrador",
  VIEWER: "Visitante",
};

export const CONSTANTS = {
  PROJECT_STATUS: projectStatusMap,
  ROLES: roleMap,
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    ADMIN_PAGE_SIZE: 10,
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PROJECT_TITLE: 200,
    MAX_PROJECT_DESCRIPTION: 500,
    MAX_PROJECT_LONG_DESCRIPTION: 5000,
  },
};
