class Element {
  constructor () {
  }

  // 获取指定名称的父节点
  getParents(element, className) {
    var that = this;
    var returnParentElement = null;

    function getParentNode(element, className) {
        if(that.isElement(element)) {
          if(element && element.classList.contains(className) && element.tagName.toLowerCase() != "body") {
              returnParentElement = element;
          } else {
              getParentNode(element.parentElement, className);
          }
        }
    }
    getParentNode(element, className);

    return returnParentElement;
  }

  isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument; 
  }
}

export default Element