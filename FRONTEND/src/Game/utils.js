export const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
export const radiansToDegrees = (radians) => radians * (180 / Math.PI);
export const parseIceUfrag = (sdp) =>
  sdp
    .split('\r\n')
    .find((x) => x.includes('a=ice-ufrag:'))
    .replace('a=ice-ufrag:', '');
