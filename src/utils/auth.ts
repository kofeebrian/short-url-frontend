function getAuthToken(): string {
  return localStorage.getItem('token') || '';
}

function setAuthToken(token: string) {
  localStorage.setItem('token', token);
}

export { getAuthToken, setAuthToken }
