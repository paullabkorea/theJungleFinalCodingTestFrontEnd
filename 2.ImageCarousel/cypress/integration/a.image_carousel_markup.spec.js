describe('ImageCarousel Markup & CSS', () => {
  it('이미지에 alt 값을 제대로 넣었는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    cy.get('img').each($el => {
      cy.wrap($el).should('have.attr', 'alt')
    });
  });

  it('각 이미지들이 순서대로 넣어졌는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    cy.get('li img').each(($img, index) => {
      expect($img.attr('src')).equal(`src/images/이미지_${index + 1}.png`);
    });
  });
});