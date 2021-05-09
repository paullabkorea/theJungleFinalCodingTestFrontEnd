# theJungleFinalCodingTestFrontEnd

더 정글 파이널 코딩테스트 프론트엔드 레파지토리입니다. 해당 레파지토리는 공개용입니다.

## 싸이프레스

### 설치하기

- https://docs.cypress.io/guides/getting-started/installing-cypress#npm-install

```bash
$ npm install cypress --save-dev
```

- 직접 설치하기의 방법도 있지만 관리의 차원에서 npm 이나 yarn 을 통해 설치하는 것이 좋음

### NPM Script 에 추가하기

- https://docs.cypress.io/guides/getting-started/installing-cypress#Adding-npm-scripts

```json
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

- `package.json` 파일에 해당 스크립트를 추가
- 단순히 로컬 프로젝트에 있는 `cypress`를 실행하는 것임
- 해당 프로젝트의 루트에 있는 `cypress` 폴더를 자동으로 읽음

### Cypress 실행해보기

- Cypress 는 크롬으로 접속할 실제 사이트가 필요함. 따로 만든 로컬이 없다면 추후에 `visit`로 테스트를 해볼 때 `https//www.naver.com`이나 기존 있는 사이트를 테스트해보아도 좋음
- 만약 자신이 만든 웹사이트를 테스트하고 싶다면 로컬로든 실제 서비스로든 떠있어야 함
- 다음은 3000번 포트로 실행하게끔 해놓은 프로젝트가 있다고 가정함

```json
{
  "scripts": {
    "start": "http-server -p 3000",
    "cypress:open": "cypress open"
  }
}
```
- 1번 터미널
```bash
$ npm start # npm 사용시
$ yarn start # yarn 사용시
```
- 2번 터미널
```bash
$ npm run cypress:open # npm 사용시
$ yarn cypress:open # yarn 사용시
```

### 테스트 파일 작성하기

- https://docs.cypress.io/guides/getting-started/writing-your-first-test#Add-a-test-file

- `cypress/integration` 폴더를 생성
- `integration` 폴더에 있는 `js` 파일을 테스트 파일로 읽어들임
- 일반적으로 테스트 파일명에 `spec` 혹은 `test`를 붙이는 것이 관례이고, `cypress`는 `spec`을 붙이는 형태로 예시를 보여주고 있음
- 이때 `spec`은 파일명에 붙여도 되고 (`sample_spec.js`) 파일 확장자와 비슷한 형태로 붙여도 됨 (`sample.spec.js`)
- 개인적으로는 `.spec.` 형태가 좋은 것 같음

#### 기본 샘플

```js
describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})
```

- `describe` 의 첫번째 매개변수는 테스트를 할 전체 타이틀이라고 보면 됨
- 그 다음 함수는 본격적인 테스트들이 들어감
- `it`은 세부적인 테스트들의 자세한 이름들 소제목이라고 보면 됨
- 대부분의 테스트는 다음과 같이 영어로 읽었을 때 바로 알아먹도록 되어 있음: 추후 테스트를 작성하는 것도 되도록 쉽게 읽을 수 있도록 쓰면 좋음 (`true`를 기대 했고 이것은 `true`랑 같다)

#### Cyrpess 본격

```js
describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('http://localhost:3000')
    // cy.visit('https://www.daum.net')

    // https://docs.cypress.io/api/commands/get
    cy.get('button').click()

    // https://docs.cypress.io/api/commands/contains#Syntax
    cy.contains('START').click()

    // https://docs.cypress.io/api/commands/should
    cy.get('img').should('have.length', 5)
  })
})
```

- `cy.visit` 는 최초 내가 사이트를 방문하겠다는 것. 왠만한 자동화 테스트는 이것으로 시작함
- `cy.get` 과 `query selector`를 통해 엘리먼트를 잡는 방법을 주로 활용함
- `cy.contains`로 `<li>START</li>`와 같이 컨텐츠의 내용을 타겟으로 해서 잡을 수도 있음
- `should`는 해당 값이 일치하는지 볼때 자주 활용하는 기능 중 하나임
