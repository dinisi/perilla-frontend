export const updateCookie = (name: string, value: string, expires?: number) => {
  let cookie = name + '=' + value
  if (expires !== undefined) {
    cookie += '; max-age=' + expires
  }
  cookie += '; path=/'
  document.cookie = cookie
}

export const getCookie = (name: string) => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const removeCookie = (name: string) => {
  updateCookie(name, '', -1)
}
