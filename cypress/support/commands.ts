export { };

// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getDataQa: (dataQaValue: string, options?: Partial<Loggable & Timeoutable>) => Cypress.Chainable<JQuery<HTMLElement>>;
      findByDataQa: (dataQaValue: string, options?: Partial<Loggable & Timeoutable>) => Cypress.Chainable<JQuery<HTMLElement>>;
      saveAuthInfo: () => void;
      restoreAuthInfo: () => void;
      chassisApiRequest: (api: 'dataFlow' | 'api', method: HttpMethod, url: string, body?: RequestBody) => Cypress.Chainable<{status: number; body: any}>;
      chassisInternalApiRequest: (method: HttpMethod, resource: string, body?: RequestBody) => Cypress.Chainable<{status: number; body: any}>;
    }

    // Assertions from chai-string plugin.
    type ChaiStringChainer =
      'startWith' | 'not.startWith' |
      'endWith' | 'not.endWith' |
      'equalIgnoreCase' | 'not.equalIgnoreCase';

    // Assertions from chai-uuid plugin.
    type ChaiUuidChainer =
      'be.a.guid' | 'not.be.a.guid';

    interface Chainer<Subject> {
      (chainer: ChaiStringChainer | ChaiUuidChainer, value: string): Chainable<Subject>;
    }
  }

  namespace Chai {
    interface TypeComparison {
      guid(): void;
    }

    interface Deep {
      match(expected: any): void;
    }
  }
}

let currentTenantId: string;
let tenants: string;
let token: string;

const dataQaSelector = (dataQaValue: string): string =>
  `[data-qa="${dataQaValue}"]`;

const getDataQa = (dataQaValue: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(dataQaSelector(dataQaValue), options);

const findByDataQa =
  (subject: Cypress.Chainable<JQuery<HTMLElement>>, dataQaValue: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.wrap(subject).find(dataQaSelector(dataQaValue), options);

const saveAuthInfo = () => {
  currentTenantId = localStorage.getItem('cleo.authentication.currentTenantId');
  tenants = localStorage.getItem('cleo.authentication.tenants');
  token = localStorage.getItem('cleo.authentication.token');
};

const restoreAuthInfo = () => {
  localStorage.setItem('cleo.authentication.currentTenantId', currentTenantId);
  localStorage.setItem('cleo.authentication.tenants', tenants);
  localStorage.setItem('cleo.authentication.token', token);
};

const chassisApiRequest = (
  api: 'dataFlow' | 'api',
  method: Cypress.HttpMethod,
  resource: string,
  body?: Cypress.RequestBody
): Cypress.Chainable<{status: number; body: any}> => {

  const apiUrl = api === 'dataFlow'
    ? Cypress.env('CHASSIS_DATA_FLOW_API')
    : Cypress.env('CHASSIS_API');

  const tenantId = localStorage.getItem('cleo.authentication.currentTenantId');

  return cy.request({
    method,
    url: `${apiUrl}${resource}?tenantId=${tenantId}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('cleo.authentication.token')).idToken}`
    },
    body
    // qs: { tenantId, isAdmin }  There's currently a bug that doesn't allow this https://github.com/cypress-io/cypress/pull/2306
  });
};

const chassisInternalApiRequest = (
  method: Cypress.HttpMethod,
  resource: string,
  body?: Cypress.RequestBody
): Cypress.Chainable<{status: number; body: any}> => {

  const internalApiUrl = Cypress.env('CHASSIS_INTERNAL_API');
  const internalApiToken = Cypress.env('INTERNAL_API_AUTH_INFO');

  const tenantId = localStorage.getItem('cleo.authentication.currentTenantId');

  return cy.request({
    method,
    url: `${internalApiUrl}${resource}?tenantId=${tenantId}`,
    headers: {
      Authorization: `Bearer ${internalApiToken}`
    },
    body
  });
};

Cypress.Commands.add('getDataQa', getDataQa);
Cypress.Commands.add('findByDataQa', { prevSubject: true }, findByDataQa);
Cypress.Commands.add('saveAuthInfo', saveAuthInfo);
Cypress.Commands.add('restoreAuthInfo', restoreAuthInfo);
Cypress.Commands.add('chassisApiRequest', chassisApiRequest);
Cypress.Commands.add('chassisInternalApiRequest', chassisInternalApiRequest);
