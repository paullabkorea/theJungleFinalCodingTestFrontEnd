// import : 사용할 모듈을 우리가 사용할 스크립트로 가져옵니다.
import StarPoint from "./Components/StarPoint/index.js";
import Favorite from "./Components/Favorite/index.js";

const starPoint = new StarPoint();
const favorite = new Favorite();

starPoint.setup();
favorite.setup();
