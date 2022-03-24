/* TODO : Find out how to handle document in Jest */
let isJestEnabled = false;


export function setJestEnabledTrue() {
  isJestEnabled = true;
}

export function getJestEnabled() {
  return isJestEnabled;
}
