describe('Movie Star', () => {
    it('Next 버튼이 정상적으로 동작하는지 확인합니다.', () => {
      cy.visit("http://localhost:3000");
      
      let images = [];
      
      cy.get('li img').each(($img) => {
        images.push($img);
      });

      const nextButton = cy.get('button.next-btn');
      nextButton.click();

      cy.get('li img').each(($img, index) => {
        let targetIndex = images.length === index + 1 ? 0 : index + 1;
        expect($img.attr('src')).equal(`src/images/이미지_${targetIndex + 1}.png`);
      });
    });

    it('Prev 버튼이 정상적으로 동작하는지 확인합니다.', () => {
        cy.visit("http://localhost:3000");
        
        let images = [];
        
        cy.get('li img').each(($img) => {
          images.push($img);
        });
  
        const nextButton = cy.get('button.prev-btn');
        nextButton.click();
  
        cy.get('li img').each(($img, index) => {
          let targetIndex = index - 1 < 0 ? images.length - 1 : index - 1;
          expect($img.attr('src')).equal(`src/images/이미지_${targetIndex + 1}.png`);
        });
      });
  });