const { EMAIL, PHONE_NO } = import.meta.env

export function getSession() {
  return {
    email: EMAIL,
    phoneNo: PHONE_NO,
    language: 'en', //TODO
  }
}

export function externalFetch(request) {
  if (request.url.startsWith('https://raw.githubusercontent.com')) {
    request.headers = {
      'User-Agent': 'zwergius',
    }
  }
  return fetch(request)
}
