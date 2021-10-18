let hiddenTextarea

const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`

const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
]

/**
 * 用来获取结点的某些样式
 * @param {*} targetElement
 */
function calculateNodeStyling(targetElement) {
  // 拿到目标元素真实的 style 数据（计算后的）
  const style = window.getComputedStyle(targetElement)
  const boxSizing = style.getPropertyValue('box-sizing')

  const paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'))

  const borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'))

  // 使它拥有目标元素所有的样式，并转换成以 ; 连接的字符串
  const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(';')

  return { contextStyle, paddingSize, borderSize, boxSizing }
}

/**
 * 用来计算文本域的高度
 * @param {*} targetNode  要计算的结点
 * @param {*} minRows 最小的行数 最小行，默认 1
 * @param {*} maxRows 最大的行数 最大行，默认 null
 */
export default function calcTextareaHeight(targetElement, minRows = 1, maxRows = null) {
  // 如果 textarea 不存在就创建一个
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    document.body.appendChild(hiddenTextarea)
  }
  let { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement)

  // 通过直接设置 style 属性，使之成为内联样式
  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`)
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || ''

  // scrollHeight 是一个元素内容高度，包括由于溢出导致的视图中不可见内容（包含 padding）
  let height = hiddenTextarea.scrollHeight
  const result = {}

  if (boxSizing === 'border-box') {
    height = height + borderSize
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize
  }

  hiddenTextarea.value = ''
  let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize

  if (minRows !== null) {
    let minHeight = singleRowHeight * minRows
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize
    }
    height = Math.max(minHeight, height)
    result.minHeight = `${minHeight}px`
  }
  if (maxRows !== null) {
    let maxHeight = singleRowHeight * maxRows
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize
    }
    height = Math.min(maxHeight, height)
  }
  result.height = `${height}px`
  hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea)
  hiddenTextarea = null
  return result
}
