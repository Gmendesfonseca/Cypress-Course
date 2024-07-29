describe('Hacker Stories', () => {
  const initialTerm = 'React';
  const newTerm = 'Cypress';

  context('Hits the real API', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialTerm,
          page: '0',
        },
      }).as('getStories');
      cy.visit('/');

      cy.assertLoadingIsShownAndHidden();
      cy.wait('@getStories');
    });

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: 'React',
          page: '1',
        },
      }).as('getNextStories');
      cy.get('.item').should('have.length', 20);

      cy.contains('More').click();
      cy.assertLoadingIsShownAndHidden();
      cy.wait('@getNextStories');

      cy.get('.item').should('have.length', 40);
    });

    it('searches via the last searched term', () => {
      cy.intercept({
        method: 'GET',
        pathname: `**/search`,
        query: {
          query: newTerm,
          page: '0',
        },
      }).as('getNewTermStories');

      cy.get('#search').clear().type(`${newTerm}{enter}`);

      cy.wait('@getNewTermStories');

      cy.get(`button:contains(${initialTerm})`).should('be.visible').click();

      cy.wait('@getStories');

      cy.get('.item').should('have.length', 20);
      cy.get('.item').first().should('contain', initialTerm);
      cy.get(`button:contains(${newTerm})`).should('be.visible');
    });
  });

  context('Mock the API', () => {
    context('Footer and List of stories', () => {
      beforeEach(() => {
        cy.intercept('GET', '**/search**', { fixture: 'stories' }).as(
          'getStories',
        );
        cy.visit('/');

        cy.assertLoadingIsShownAndHidden();
        cy.wait('@getStories');
      });

      it('shows the footer', () => {
        cy.get('footer')
          .should('be.visible')
          .and('contain', 'Icons made by Freepik from www.flaticon.com');
      });

      context('List of stories', () => {
        it('shows the right data for all rendered stories', () => {
          cy.fixture('stories').then((stories) => {
            stories.hits.forEach((story, index) => {
              cy.get(`.item:nth-child(${index + 1})`)
                .should('contain', story.title)
                .and('contain', story.author)
                .and('contain', story.num_comments)
                .and('contain', story.points);
              cy.get(`.item a:nth-child(${index + 1})`).should(
                'have.attr',
                'href',
                story.url,
              );
            });
          });
        });

        it('shows only nineteen stories after dimissing the first story', () => {
          cy.get('.button-small').first().click();

          cy.get('.item').should('have.length', 2);
        });

        context('Order by', () => {
          it('orders by title', () => {
            cy.get('.list-header-button:contains(Title)')
              .as('titleHeader')
              .click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(stories.hits, 'title');
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.title,
                );
              });
            });
            const stories = require('../fixtures/stories');
            cy.get('.item').first().should('contain', stories.hits[0].title);

            cy.get('@titleHeader').click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(
                stories.hits,
                'title',
              ).reverse();
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.title,
                );
              });
            });
            cy.get('.item').first().should('contain', stories.hits[2].title);
          });

          it('orders by author', () => {
            cy.get('.list-header-button:contains(Author)')
              .as('authorHeader')
              .click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(stories.hits, 'author');
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.author,
                );
              });
            });
            const stories = require('../fixtures/stories');
            cy.get('.item').first().should('contain', stories.hits[0].author);

            cy.get('@authorHeader').click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(
                stories.hits,
                'author',
              ).reverse();
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.author,
                );
              });
            });
            cy.get('.item').first().should('contain', stories.hits[2].author);
          });

          it('orders by comments', () => {
            cy.get('.list-header-button:contains(Comments)')
              .as('commentsHeader')
              .click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(
                stories.hits,
                'comments',
              ).reverse();
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.num_comments,
                );
              });
            });
            const stories = require('../fixtures/stories');
            cy.get('.item')
              .first()
              .should('contain', stories.hits[2].num_comments);
            cy.get('@commentsHeader').click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(
                stories.hits,
                'num_comments',
              );
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.num_comments,
                );
              });
            });
            cy.get('.item')
              .first()
              .should('contain', stories.hits[0].num_comments);
          });

          it('orders by points', () => {
            cy.get('.list-header-button:contains(Points)')
              .as('pointsHeader')
              .click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(
                stories.hits,
                'points',
              ).reverse();
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.points,
                );
              });
            });
            const stories = require('../fixtures/stories');
            cy.get('.item').first().should('contain', stories.hits[2].points);

            cy.get('@pointsHeader').click();
            cy.fixture('stories').then((stories) => {
              const sortedStories = Cypress._.sortBy(stories.points, 'points');
              sortedStories.forEach((story, index) => {
                cy.get(`.item:nth-child(${index + 2})`).should(
                  'contain',
                  story.points,
                );
              });
            });
            cy.get('.item').first().should('contain', stories.hits[0].points);
          });
        });
      });
    });

    context('Search', () => {
      beforeEach(() => {
        cy.intercept('GET', `**/search?query=${initialTerm}&page=0`, {
          fixture: 'empty',
        }).as('getEmptyStories');

        cy.intercept('GET', `**/search?query=${newTerm}&page=0`, {
          fixture: 'empty',
        }).as('getStories');

        cy.visit('/');

        cy.wait('@getEmptyStories');
        cy.get('#search').clear();
      });

      it('types and hits ENTER', () => {
        cy.get('#search').type(`${newTerm}{enter}`);
        // cy.assertLoadingIsShownAndHidden();

        cy.wait('@getStories');

        cy.get('.item').should('have.length', 0);
        cy.get(`button:contains(${initialTerm})`).should('be.visible');
      });

      it('types and clicks the submit button', () => {
        cy.get('#search').type(newTerm);
        cy.contains('Submit').click();

        // cy.assertLoadingIsShownAndHidden();
        cy.wait('@getStories');

        cy.get('.item').should('have.length', 0);
        cy.get(`button:contains(${initialTerm})`).should('be.visible');
      });

      it('types and submits the directly', () => {
        cy.get('#search').type(newTerm);
        cy.get('form').submit();

        cy.wait('@getStories');

        cy.get('.item').should('have.length', 0);
      });

      context('Last searches', () => {
        it('shows a max of 5 buttons for the last searched terms', () => {
          const faker = require('faker');

          cy.intercept(
            'GET',
            '**/search**',

            { fixture: 'empty' },
          ).as('getRandomStories');

          Cypress._.times(6, () => {
            cy.get('#search').clear().type(`${faker.random.word()}{enter}`);
            cy.wait('@getRandomStories');
          });

          // cy.assertLoadingIsShownAndHidden();

          cy.get('.last-searches button').should('have.length', 5);
        });
      });
    });

    context('Errors', () => {
      it('shows "Something went wrong ..." in case of a server error', () => {
        cy.intercept(
          {
            method: 'GET',
            pathname: '**/search**',
          },
          { statusCode: 500 },
        ).as('getServerError');

        cy.visit('/');
        cy.wait('@getServerError');

        cy.get('p').should('contain', 'Something went wrong ...');
      });

      it('shows "Something went wrong ..." in case of a network error', () => {
        cy.intercept(
          {
            method: 'GET',
            pathname: '**/search**',
          },
          { forceNetworkError: true },
        ).as('getNetworkError');

        cy.visit('/');
        cy.wait('@getNetworkError');

        cy.get('p:contains(Something went wrong ...)').should('be.visible');
      });
    });
  });
});
