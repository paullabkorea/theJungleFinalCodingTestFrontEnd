export const fetchMusics = async () => {        // 비동기 방식으로 함수를 실행하게합니다.
    const response = await fetch('/musics');    //fetch 를 통해 /musics 를 서버에 요청합니다.

    return await response.json();               // 전달 받은 데이터를 json으로 파싱합니다.
}