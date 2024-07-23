const accessToken = `Bearer ${Cypress.env('gitlab_access_token')}`;

Cypress.Commands.add('api_login', () => {
  cy.request({
    method: 'POST',
    url: '/api/v4/user',
    headers: {
      Authorization: accessToken,
    },
  });
});

Cypress.Commands.add('api_getAllProjects', () => {
  cy.request({
    method: 'GET',
    url: '/api/v4/projects/',
    headers: { Authorization: accessToken },
  });
});

Cypress.Commands.add('api_createProject', (project) => {
  cy.request({
    method: 'POST',
    url: '/api/v4/projects',
    headers: {
      Authorization: accessToken,
    },
    body: {
      name: project.name,
      description: project.description,
      initialize_with_readme: true,
    },
  });
});

Cypress.Commands.add('api_deleteProjects', () => {
  cy.api_getAllProjects().then((res) =>
    res.body.forEach(
      async (project) =>
        await cy.request({
          method: 'DELETE',
          url: `/api/v4/projects/${project.id}`,
          headers: { Authorization: accessToken },
        }),
    ),
  );
});

Cypress.Commands.add('api_createIssue', (issue) => {
  cy.api_createProject(issue.project).then((response) => {
    cy.request({
      method: 'POST',
      url: `/api/v4/projects/${response.body.id}/issues`,
      headers: {
        Authorization: accessToken,
      },
      body: {
        title: issue.title,
        description: issue.description,
      },
    });
  });
});

Cypress.Commands.add('api_createLabel', (projectId, label) => {
  cy.request({
    method: 'POST',
    url: `/api/v4/projects/${projectId}/labels`,
    headers: {
      Authorization: accessToken,
    },
    body: {
      name: label.name,
      color: label.color,
    },
  });
});

Cypress.Commands.add('api_createMilestone', (projectId, milestone) => {
  cy.request({
    method: 'POST',
    url: `/api/v4/projects/${projectId}/milestones`,
    body: { title: milestone.title },
    headers: { Authorization: accessToken },
  });
});
