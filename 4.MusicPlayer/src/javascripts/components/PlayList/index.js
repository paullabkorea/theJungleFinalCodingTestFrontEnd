import { findIndexListElement, getClosestElement } from '../../utils/index.js';

/**
 * 음악 플레이 리스트를 담당하는 컴포넌트
 */
export default class PlayList {
    constructor() {
        this.rootElement = PlayList.createRootElement();
        this.musicList = [];
        // 로컬 스토리지에 저장해놓은 것이 있으면 호출
        this.loadStorage();
        // 이벤트 바인딩
        this.bindEvents();
    }

    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-playlist');

        return rootElement;
    }

    bindEvents() {
        // 버튼이 눌릴 때 두가지 종류만 있기 때문에 재생 / 삭제로만 구분하였다.
        this.rootElement.addEventListener('click', (event) => {
            const { target } = event;
            const isControllerButton = target.tagName === 'BUTTON';
            // 컨트롤 버튼은 - 버튼(제거버튼) 뿐이므로 이게 아닌 경우에는 음악 재생
            if (!isControllerButton) {
                return this.playMusicItem(target);
            }
            console.log('..');
            // - 버튼 경우에는 플레이 리스트에 있는 음악 제거
            this.removeMusicItem(target);
        })
    }

    // 다음 음악을 재생하는 기능, 만약 payload를 넣을 경우에는 repeat, random 을 체크하여 처리한다. 현재 payload 는 playview에서만 넘어오도록 되어 있다.
    playNext(payload) {
        // 가지고 있는 플레이 리스트에서 현재 실행중인 음악을 찾음 
        let currentIndex = this.musicList.findIndex(music => music.playing);
        // 마지막 리스트에 있는 것인지 확인
        const isMusicIndexEnd = currentIndex >= this.musicList.length - 1;
        if (isMusicIndexEnd) {
            // 마지막 리스트에 있는 음악이면 초기화 (나중에 +1을 더할 것이기 때문에 -1로 설정)
            currentIndex = -1;
        }

        // 만약 옵션값이 같이 넘어오는 경우에는 플레이뷰에서 요청한 것이기 때문에 반복, 랜덤 여부를 체크
        if (payload) {
            const { repeat, random } = payload;

            // 반복도 랜덤도 없고 리스트 끝 음악이 종료된 것이면 그대로 음악 재생은 더이상 하지 않음
            if (!random && !repeat && isMusicIndexEnd) {
                return;
            }

            // 랜덤인 경우에는 다른 랜덤 재생할 음악을 찾음
            if (random) {
                currentIndex = Math.floor(Math.random() * (this.musicList.length - 2));
            }

            // 반복인 경우에는 그냥 하던대로 다음 곡을 연주시키면 됨
        }

        const nextIndex = currentIndex + 1;
        this.playMusicItem(nextIndex);
    }

    // 이전 음악을 재생하는 기능
    playPrev() {
        // 현재 연주중인 음악을 찾음
        let currentIndex = this.musicList.findIndex(music => music.playing);
        // 첫번째 음악인 경우에는 뒤로가기 하면 리스트의 마지막 곡을 재생해야 하기 때문에 마지막보다 +1인 음악 리스트의 length로 초기화 (나중에 -1 해줄 것이기 때문에)
        if (currentIndex <= 0) {
            currentIndex = this.musicList.length;
        }
        const prevIndex = currentIndex - 1;
        this.playMusicItem(prevIndex);
    }

    // 실질적으로 플레이리스트의 몇번째 음악인지를 받아 처리하는 부분
    playMusicItem(target) {
        // 두가지 옵션을 다 처리하기 위해 target은 number 혹은 element로 받고 있음 (이부분은 좀더 좋게 바꾸면 좋긴 하지만 여기서는 일단 이렇게 처리) 그 후에 숫자인 경우에는 다시 li element를 찾아옴
        const listItemElement = typeof target === 'number' ? this.rootElement.querySelectorAll('LI')[target] : getClosestElement(target, 'LI');
        // 플레이 리스트의 순서에 맞게 하기 위해 element가 몇번째 인덱스인지 찾음. 위에 target이 있긴한데 listItemElement는 나중에 다시 사용해야해서 우선 함께 둠
        const musicIndex = findIndexListElement(listItemElement);
        // 현재 재생 중인 음악인지 파악
        const requestPlay = this.musicList[musicIndex].playing;
        // 모든 음악의 상태를 정지로 변경 (현재 재생중인지는 이미 파악했기 때문에)
        this.musicList.forEach(musicInfo => {
            musicInfo.playing = false
        });
        // 엘리먼트에서도 모든 재생중인 상태를 가리키는 on 클래스를 제거
        this.rootElement.querySelectorAll('LI').forEach(element => element.classList.remove('on'));
        // 현재 재생중이 아니면 재생을 요청하고, 재생중이면 정지를 요청합니다.
        if (!requestPlay) {
            // 재생 표시를 위한 on을 달아줍니다.
            listItemElement.classList.add('on');
            // 현재 재생이라는 표시를 합니다.
            this.musicList[musicIndex].playing = true;
            // 부모 컴포넌트에 재생 요청을 합니다. app.js 는 이것을 받아서 다시 플레이뷰에 재생 요청을 합니다.
            this.emit('play', { musics: this.musicList, musicIndex });
        } else {
            // 현재 재생이 끝났음을 표시합니다.
            listItemElement.classList.remove('on');
            // 부모 컴포넌트에 멈추라는 요청을 합니다. app.js 는 이것을 받아서 다시 플레이뷰에 멈춤 요청을 합니다.
            this.emit('pause');
        }

    }

    // 플레이 리스트에서 음악 제거
    removeMusicItem(target) {
        // 받아온 엘리먼트를 가지고 어떤 li인지 찾습니다.
        const listItemElement = getClosestElement(target, 'LI');
        // 그 li 의 인덱스를 찾아 몇번째 음악 인덱스인지를 파악합니다. (데이터와 li 가 일치하기 때문에 이런식으로 찾을 수 있습니다. 정확한 찾기를 원한다면 id를 심어서 핸들링하는 방식으로 추천합니다.)
        const musicIndex = findIndexListElement(listItemElement);
        // 가져온 값은 문자열로 된 숫자이기 때문에 숫자로 바꿔주고 remove 합니다. 현재 플레이 리스트가 가진 음악에서 대상을 제거합니다.
        this.remove(Number(musicIndex));
        // 그리고 부모 ul 을 찾아 제거해줍니다. 전체를 완전히 새로 렌더링을 해버리면 깜빡임이 있기 때문에 이런식으로 처리해줍니다.
        listItemElement.parentElement.removeChild(listItemElement);
    }


    // 플레이 리스트에 음악 추가
    add(music) {
        // 음악리스트에 음악을 추가합니다.
        this.musicList.push(music);
        // 로컬스토리지에 저장합니다.
        this.saveStorage();
    }

    // 플레이 리스트에서 음악 제거
    remove(index) {
        // 음악리스트에 해당 인덱스의 음악을 제거합니다.
        this.musicList.splice(index, 1);
        // 로컬스토리지에 저장합니다.
        this.saveStorage();
    }

    // 저장소에서 임시저장한 음악 리스트 호출
    loadStorage() {
        // 플레이 리스트 키를 가지고 임시저장한 음악 리스트를 호출합니다.
        const stringifiedPlaylist = localStorage.getItem('playlist');
        try {
            // 호출된 값은 문자열로 되어있기 때문에 JSON.parse를 해줍니다.
            const playList = JSON.parse(stringifiedPlaylist);
            // 만약 값이 없다면 null 일수 있기 때문에 확인을 한 후 그대로 담아주거나 빈배열로 처리해줍니다.
            this.musicList = playList instanceof Array ? playList : [];
        } catch (e) {
            // 스토리지는 모바일에서 용량 문제 등으로 에러가 발생할 수 있기 때문에 try - catch 처리를 잘해줍니다.
            console.error(e);
        }
    }

    /**
     * 다음에 다시 호출할 수 있도록 로컬 스토리지에 저장합니다.
     * 원본은 플레이 중일 수도 있기 때문에 map 을 사용하여 새로운 복제본을 만들거나
     * 복제본을 JSON 을 활용하여 만든 다음 playing 상태를 제거하세요.
     */
    saveStorage() {
        // 가진 음악 리스트 중에 상태를 표현하는 playing 때문에 필요한 값만 가져와서 새로운 복사본을 만듭니다.
        const musicList = this.musicList.map(
            ({ artists, cover, source, title }) => ({ artists, cover, source, title })
        );
        try {
            // JSON.stringify 를 통해 문자열로 저장해줍니다.
            localStorage.setItem('playlist', JSON.stringify(musicList));
        } catch (e) {
            // 스토리지는 모바일에서 용량 문제 등으로 에러가 발생할 수 있기 때문에 try - catch 처리를 잘해줍니다.
            console.error(e);
        }
    }

    // 공통 이벤트입니다. 만약 시험에서 사용하시게 된다면 각 Component에 따로 두는 것보다 공통 베이스 컴포넌트를 만들어서 상속받는 형태로 하시는 것이 좋습니다. (5)번에 샘플이 있습니다.
    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    // 공통 이벤트입니다. 만약 시험에서 사용하시게 된다면 각 Component에 따로 두는 것보다 공통 베이스 컴포넌트를 만들어서 상속받는 형태로 하시는 것이 좋습니다. (5)번에 샘플이 있습니다.
    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }

    // 화면 렌더링 가지고 있는 데이터를 가지고 전체 렌더링을 실행합니다. innerHTML 을 활용하여 빠르게 렌더링하도록 했습니다. (코드 작성에 유리하기 때문에 과제 테스트의 경우에는 시간이 부족할 수 있어 이렇게 처리하는 것이 유리합니다.)
    // 혹은 좀더 디테일하게 하고자하시는 분들은 엘리먼트 생성 유틸 함수를 하나 작성하시는 것이 좋습니다. 
    render() {
        const playListTitle = `<h2 class="playlist-title">MY PLAYLIST</h2>`;
        const musicsList = this.musicList.map((music, index) => {
            const { cover, title, artists } = music;
            return `
                <li>
                    <div class="music-content">
                        <div class="music-data">
                            <div class="music-cover">
                                <img src="${cover}" />
                            </div>
                            <div class="music-info">
                                <strong class="music-title">${title}</strong>
                                <em class="music-artist">${artists[0]}</em>
                            </div>
                        </div>
                        <div class="music-simple-controller">
                            <button class="icon icon-minus">
                                <span class="invisible-text">제거</span>
                            </button>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
        this.rootElement.innerHTML = playListTitle + '<ul class="music-list">' + musicsList + '</ul>';
        return this.rootElement;
    }
}