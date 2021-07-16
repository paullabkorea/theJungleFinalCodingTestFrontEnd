class ColaGenerator {
    constructor() {
        this.itemList = document.querySelector(".list-item");
    }

    setup() {
        this.loadData((json) => {
            this.colaFactory(json);
        });
    }

    loadData(callback) {
        const requestObj = new XMLHttpRequest(); // 서버와 통신하기 위한 객체로 모든종류의 데이터를 받아오는데 사용합니다. http, file, ftp 프로토콜을 모두 지원합니다.
        requestObj.open('GET', '/src/js/items.json'); //요청 시작
        requestObj.onreadystatechange = () => { // readystate 가 변화하면 실행 
            if (requestObj.readyState == 4 && requestObj.status == "200") { // readyState 4는 request 에 대한 처리가 끝났음을 의미. status 200은 request 를 처리하는 과정에 이상이 없었음을 의미 
                callback(JSON.parse(requestObj.responseText)); // responseText : 응답값을 텍스트 문자열로 반환
            }
        };
        requestObj.send(null); // 서버로 데이터를 보냅니다.
    }

    colaFactory(data) {
        data.forEach(el => {
            const item = document.createElement('li');
            let itemTemplate = `
            <button type="button" class="btn-item" data-item="${el.name}" data-count="${el.count}" data-price="${el.cost}" data-img="${el.img}">
                <img src="./src/images/${el.img}" alt="" class="img-item">
                <strong class="tit-item">${el.name}</strong>
                <span class="txt-price">${el.cost}원</span>
            </button>
            `; // template literal : IE에서 불가능 주의!
            item.innerHTML = itemTemplate;
            this.itemList.appendChild(item);
        });
    }
}

export default ColaGenerator;