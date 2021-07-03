export default (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
