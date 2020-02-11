export const iOSSafari = userAgent => {
  return userAgent.match(/(iPod|iPhone|iPad)/) && userAgent.match(/AppleWebKit/)
};
