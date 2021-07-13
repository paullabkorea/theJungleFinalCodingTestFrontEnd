# Animal Album

> 동물 사진을 모아놓은 앨범을 만듭니다.

## 목표

### 탐색기

- 처음 진입했을 때 ROOT 화면 구성되어야 합니다.

- 폴더를 탐색하면 상단의 네비게이션에 표현이 되어야 합니다. 네비게이션을 눌렀을 때 바로 이동하는 기능을 추가하면 더욱 좋습니다.

- 뒤로가기 버튼을 눌렀을 경우에는 직전의 폴더로 이동해야 합니다.

- 이미지 파일을 누르면 이미지 뷰어를 띄워야 합니다.

- 데이터를 호출해올 때에는 로딩 화면을 띄워야 합니다.

## 개발환경 구성

> - Express 서버를 활용한 개발 환경이 구성되어 있습니다.

```bash
$ npm install
$ npm start
```

## 데이터

### ROOT 

> http://localhost:3000/files/

- ROOT API의 데이터들에는 `parent` 값이 없습니다.

```json
[
  {
    "id": "1",
    "type": "DIRECTORY",
    "name": "이미지폴더_1",
    "filePath": null,    
    "parent": null,
  },
  {
    "id": "2",
    "type": "DIRECTORY",
    "name": "이미지폴더_2",
    "filePath": null,    
    "parent": null,
  },
]
```

### FILE

> http://localhost:3000/files/:nodeId

```json
[
  {
    "id": "6",
    "type": "DIRECTORY",
    "name": "이미지폴더_1",
    "filePath": null,
    "parent": {"id": "3"},

  },
  {
    "id": "8",
    "type": "FILE",
    "name": "이미지_1",
    "filePath": "/public/images/image_1.jpg",    
    "parent": {"id": "3"},
  },
]
```

### IMAGE FILE PATH

> `baseURL` + `file.filePath` 의 구성으로 이루어 집니다.

- baseURL: http://localhost:3000/
- filePath: /public/images/file_image.png
- image source path: http://localhost:3000/public/images/file_image.png

## 구현 조건

- *라이브러리*의 추가는 금지합니다.

- api 파일을 분리하는 것을 추천합니다.

- async - await의 활용을 추천합니다.

- API의 호출은 `fetch`를 활용합니다.

- try - catch 를 활용한 에러의 처리를 추천합니다.

- 필요하다면 `element`, `css`의 수정은 가능합니다.

- script DOM 의 type="module" 활용을 추천합니다.
