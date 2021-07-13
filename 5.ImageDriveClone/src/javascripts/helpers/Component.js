// 이벤트 바인딩을 위해 상속할 기본 컴포넌트 입니다. 다른 컴포넌트 자체의 공통기능이 있다면 넣어도 좋습니다.
class Component {
    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }
}

export default Component;
