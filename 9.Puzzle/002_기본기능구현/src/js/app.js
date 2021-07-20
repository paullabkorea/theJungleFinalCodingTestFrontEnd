const defaultLocation = []
const movePeaceArr = [] // default 위치에서 얼마큼 이동했는지 저장하는 배열

const peaces = document.querySelectorAll('.peace')
const voidPeace = document.querySelector('.void')
const moveCount = document.querySelector('.move_count')
const timer = document.querySelector('.timer')
const answer = document.querySelector('.answer')
const puzzle = document.querySelector('.puzzle')

let move = 0
let time = 0
let timeCounter = null

// 숫자가 9 이하이면 앞에 0 추가 ex) '08'
function convertNum(num) {
    return num > 9 ? num : '0' + num
}

// 시간 표시하는 함수
function setTime() {
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    timer.innerHTML = convertNum(minutes) + ':' + convertNum(seconds)
}

function timeCount() {
    time++
    setTime()
}

function moveCountDisplay() {
    move++
    moveCount.innerHTML = move
}

// 이동횟수, 시간 초기화
function initMoveTime() {
    move = 0
    time = 0
    moveCount.innerHTML = move
    if (timeCounter) {
        clearInterval(timeCounter)
        setTime()
    }
}

// 현재 위치에서 이동한 위치를 확인하여 정답 확인
// 모든 퍼즐의 이동한 거리가 0이면 정답으로 처리
function answerCheck() {
}

// 퍼즐 이동
function peaceMove(target, checkVoid, dir) { 
}

// 빈 공간인지 확인
function isVoid(checkVoid) {
}

function answerView() {
    document.querySelector('.answer_move').innerHTML = `move : ${moveCount.innerHTML}`    
    document.querySelector('.answer_time').innerHTML = `time : ${timer.innerHTML}`

    puzzle.removeEventListener('click', moveEvent)
    initMoveTime()
    answer.style.display = 'block'
}

// select 퍼즐 기준 상,하,좌,우 탐색
function findVoid(target, x, y) {
}

// 클릭한 퍼즐의 좌표(x, y) 추출
function moveEvent(e) {
}

// 좌표값을 랜덤으로 섞고 바뀐 좌표와 default 좌표에 차이를 입력
function random() {
}

//최초에 init을 하기위한 함수, 
function setPeace() { 
    peaces.forEach((el, i) => el.style.transform = `translate(${movePeaceArr[i][0]}px, ${movePeaceArr[i][1]}px)`)
    voidPeace.style.transform = `translate(${movePeaceArr[movePeaceArr.length - 1][0]}px, ${movePeaceArr[movePeaceArr.length - 1][1]}px)`
}

function gameStart() {
    initMoveTime()
    random()
    puzzle.addEventListener('click', moveEvent)
    setPeace()
    timeCounter = setInterval(timeCount, 1000)
}

function resetGame() {
    setPeace()
    puzzle.removeEventListener('click', moveEvent)
    initMoveTime()
}

// 퍼즐 각각의 위치 값 저장, movePeaceArr 초기화
function init() {
    document.querySelector('.start_button').addEventListener('click', gameStart)
    document.querySelector('.reset_button').addEventListener('click', resetGame)
    document.querySelector('.answer_button').addEventListener('click', () => answer.style.display = 'none')
}

init()