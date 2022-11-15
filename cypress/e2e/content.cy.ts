import { RACING_CATEGORIES } from "../config/constants";

describe('Page Content', () => {
  it('Should correctly display page title', () => {
    cy.visit('');

    cy.get('[data-testid=page-title]').contains('Next To Go Races').and('be.visible');

  });

  it('Should have all filters checked by default', () => {
    cy.visit('');

    cy.get('[data-testid=category-filters]').within(() => {
      RACING_CATEGORIES.forEach((category) => {
        cy.get(`[data-testid=category-filter-${category.categoryId}]`).within(() => {
          cy.get('[data-testid=category-filter-label]').contains(category.name).and('be.visible');
          cy.get('[data-testid=category-filter-checkbox]').should('be.checked');
        });
      })
    });
  })


  it('Should have 5 items in the list', () => {
    cy.visit('');
    cy.get('[data-testid="Next2go"]').should(($lis) => {
      expect($lis).to.have.length(5);
    });
  })

  it('Should have content for race name/number and countdown', () => {
    cy.visit('');
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="next2go-list"]>div>div>b').eq(i).should('not.be.empty'); //race number
      cy.get('[data-testid="next2go-list"]>div>div>p').eq(i).should('not.be.empty'); //race name
      cy.get('[data-testid="next2go-list"]>div>p').eq(i).should('not.be.empty'); //count down timer
      //  cy.get(':nth-child(2) > .race-name > p').should('not.be.empty');
      //  cy.get(':nth-child(2) > .race-name > .race-number').should('not.be.empty');
      //  cy.get('[data-testid="LoadingSpinner"] > :nth-child(1) > :nth-child(1) > :nth-child(2)').should('not.be.empty');
    }
  })


  it('if countdown less than -59s, the race should be removed', () => {
    cy.visit('');
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="count-down-timer"]').eq(i).then((time) => {
        if (time.text().includes('m')) {
          //time.invoke('text').should('not.have.text', 'm')
          cy.wrap(time).should('not.contain', '-')
        }
      })
    }
  })



  it('should update the count down timer string every second', () => {
    cy.visit('');

    for (let i = 0; i < 5; i++) {
      //found that if countdown greater than 5m, will not display countdown for seconds
      cy.get('[data-testid="count-down-timer"]').eq(i).then((time) => {
        if (time.text().includes('s')) {
          cy.get('[data-testid="count-down-timer"]').eq(i).invoke('text').
            then((timmer1) => {
              cy.wait(2000); //set time interval 2s
              cy.get('[data-testid="count-down-timer"]').eq(i).invoke('text').should((timmer2) => { expect(timmer1).not.to.equal(timmer2) })
            }
            )
        }
        else {  //if not contians 's', means greater than 5m
          cy.get('[data-testid="count-down-timer"]').eq(i).invoke('text').
            then((timmer1) => {
              cy.wait(60000); //set time interval 1min
              cy.get('[data-testid="count-down-timer"]').eq(i).invoke('text').should((timmer2) => { expect(timmer1).not.to.equal(timmer2) })
            }
            )
        }
      })
    }
  }
  );


});
