/**
 * 生成一个随机字符串
 * @param len 
 * @returns 
 */
export function randomString(len: number = 10) {
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789";
  var maxPos = chars.length;
  var pwd = "";
  for (let i = 0; i < len; i++) {
    pwd = pwd + chars[Math.floor(Math.random() * maxPos)];
  }
  return pwd
}

/**
 * 格式化时间
 * @param len
 * @returns
 */
export function formateTime(str: number | string) {
  return ('0' + str).slice(-2)
}