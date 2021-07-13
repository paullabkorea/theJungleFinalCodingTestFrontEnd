# Music Player

## API

- 제공되는 음악 API는 musics 하나입니다.
- http://localhost:3000/musics
- vote 는 이번 시간에는 사용하지 않는 데이터입니다.

```json
[
    {
        "title": "Bourree",
        "artists": ["Joel Cummins"],
        "cover": "/public/images/cover/bourree.png",
        "source": "/public/musics/Bourree - Joel Cummins.mp3",
        "vote": 39457
    },
    {
        "title": "Bourree",
        "artists": ["Joel Cummins"],
        "cover": "/public/images/cover/bourree.png",
        "source": "/public/musics/Bourree - Joel Cummins.mp3",
        "vote": 39457
    }
]
```

## 작업의 순서

> 정해진 것은 아니지만 다음 순서를 추천합니다.

- App.js 생성 후 하위 컴포넌트를 붙이는 방식으로 진행
- Intro - 초기 로딩 화면 (첫 테스트 후에 셋타임아웃등 제거)
- TabButtons - 푸터에 붙을 탭버튼들
- TopMusics - 첫번째 탭에 붙을 탑뮤직 컴포넌트
- SearchView - 세번째 탭에 붙을 검색뷰 컴포넌트
- PlayList - 두번째 탭에 붙을 플레이 리스트 컴포넌트
- PlayView - 플레이 리스트에서 클릭시 열람되는 플레이뷰 컴포넌트


### 확인사항

- 음악이 재생중이거나 할때에는 on 클래스를 사용하여 핸들링하고 있습니다. li 일 때는 li에 on 이 붙으며 button 인 경우에는 button 자체에 on 이 붙는 식입니다.