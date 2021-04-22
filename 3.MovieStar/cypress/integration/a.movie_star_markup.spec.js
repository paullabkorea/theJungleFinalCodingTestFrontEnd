describe('Movie Star Markup & CSS', () => {
  it('이미지에 alt 값을 제대로 넣었는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    cy.get('img').each($el => {
      cy.wrap($el).should('have.attr', 'alt')
    });
  });

  it('별점 초기화가 잘 되어 있는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    cy.get('.star-background img')
      .should('have.length', 5)
      .each(($img) => expect($img.prop('src')).equal('http://localhost:3000/src/assets/images/icon_empty_star.png'));
  });
});