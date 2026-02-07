//LocalStorage
/**
 * only send object|string|number (not json!)
 */
export function Add(key, value) {
     localStorage.setItem(key, JSON.stringify(value));
}
export function Get(key) {
     return JSON.parse(localStorage.getItem(key));
}
export function Del(key) {
     localStorage.removeItem(key);
}