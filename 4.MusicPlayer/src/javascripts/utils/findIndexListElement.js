const findIndexListElement = (element) => {
    const listItems = element.parentElement.querySelectorAll('li');
    const currentIndex = Array.prototype.slice.call(listItems).findIndex(listItem => listItem === element);

    return currentIndex;
}

export default findIndexListElement;