export const isEventSupported = (tagName: string, eventName: string) => {
  const el = document.createElement(tagName);
  const attributeName = 'on' + eventName;
  let isSupported = (attributeName in el);
  if (!isSupported) {
    el.setAttribute(attributeName, 'return;');
    isSupported = typeof el[attributeName] == 'function';
  }
  el.remove()
  return isSupported;
}