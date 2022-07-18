import CryptoJS from 'crypto-js'
// 加密
export function Encrypt(data) {
  // 编码 key
  const key = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_KEY)
  // 编码iv
  const iv = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_IV)
  // 编码data
  data = CryptoJS.enc.Utf8.parse(data)
  // 加密模式为CBC，补码方式为NoPadding
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  console.log('加密后的数据:', encrypted.toString())
  // 返回base64
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
// 解密
export function Decrypt(data) {
  // 编码 key
  const key = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_KEY)
  // 编码iv
  const iv = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_IV)
  // Base64编码
  const base64 = CryptoJS.enc.Base64.parse(data)
  const base64Str = CryptoJS.enc.Base64.stringify(base64)
  const decrypt = CryptoJS.AES.decrypt(base64Str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  console.log('解密后的数据:', decryptedStr.toString())
  return decryptedStr.toString()
}
