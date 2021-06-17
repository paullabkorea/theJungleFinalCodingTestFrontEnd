describe('ImageCarousel Markup & CSS', () => {
  it('이미지에 alt 값을 제대로 넣었는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    cy.get('.carousel__item img').each($el => {
      cy.wrap($el).should('have.attr', 'alt')
    });
  });
});