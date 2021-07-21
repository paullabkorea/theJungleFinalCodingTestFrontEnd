export { default as Intro } from './Intro/index.js'
export { default as PlayList } from './PlayList/index.js'
export { default as PlayView } from './PlayView/index.js'
export { default as SearchView } from './SearchView/index.js'
export { default as TabButtons } from './TabButtons/index.js'
export { default as TopMusics } from './TopMusics/index.js'

// 각 컴포넌트들을 이곳 index.js 에서 다시 묶어서 내보내줍니다.
// { Intro, PlayList ...} 처럼 쓸 수 있습니다.
// 여기서 묶어서 보내주는 이유는
// 외부에서 사용시에 components/index.js 에서 바로 꺼내서 쓸 수 있기 때문에가 첫번째고 (특히 웹팩 사용시에 더 유리합니다.)
// 이렇게 중간 경유지가 있으면 PlayList/index.js 파일에서 결과만 같으면 어떤 변화가 생겨도 다른 사용처에서는 신경쓸 필요가 없기 때문입니다.