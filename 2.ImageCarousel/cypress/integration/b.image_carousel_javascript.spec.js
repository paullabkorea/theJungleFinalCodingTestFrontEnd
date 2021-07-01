// reference types="cypress" = 사이프러스 라이브러리 autocomplete 
///<reference types="cypress"/>
describe('ImageCarousel js', () => {
  // it 을 통한 테스트 블록 생성, 첫번째 인자로 테스트 제목. 
  it('Next 버튼이 정상적으로 동작하는지 확인합니다.', () => {
    // cy : 사이프러스 객체. 모든 사이프러스 메서드를 사용할수 있게 함.
    // visit : 해당 url에 접속 
    cy.visit("http://localhost:3000");

    const images = [];
    // get : dom 셀렉터 
    cy.get('.carousel__list img').each(($img) => { // each : 여러개의 요소를 순환
      images.push($img);
    }).then(() => {
      const nextButton = cy.get('button.next-btn');
      // click(): 클릭 액션
      nextButton.click();

      cy.get('.carousel__list img').each(($img, index) => {
        const targetIndex = images.length === index + 1 ? 0 : index + 1;
        expect($img.attr('src')).equal(`src/images/이미지_${targetIndex + 1}.png`);
      });
    });
  });

  it('Prev 버튼이 정상적으로 동작하는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    const images = [];

    cy.get('.carousel__list img').each(($img) => {
      images.push($img);
    }).then(() => {
      const nextButton = cy.get('button.prev-btn');
      nextButton.click();

      cy.get('.carousel__list img').each(($img, index) => {
        const targetIndex = index - 1 < 0 ? images.length - 1 : index - 1;
        expect($img.attr('src')).equal(`src/images/이미지_${targetIndex + 1}.png`);
      });
    });
  });

  it('이미지 업로드가 정상적으로 잘되는지 확인합니다.', () => {
    cy.visit("http://localhost:3000");

    const images = [];

    cy.get('.carousel__list img').each(($img) => images.push($img)).then(() => {
      const imagesLength = images.length;
      cy.get('.carousel__list img').should('have.length', imagesLength);
      cy.get('input[type="file"]').attachFile('upload_image.png');
      cy.wait(1500);
      cy.get('.carousel__list img').should('have.length', imagesLength + 1);
    });
  });
});