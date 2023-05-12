// 確認為網址正則
// eslint-disable-next-line no-useless-escape
const express = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

export const urlRegex = new RegExp(express)

// 檢查是否為空白字串
export function checkStringNotBlank(value: string): boolean {
  return value.trim().length > 0
}

// 檢查是否為空字串，若不是空字串則需 >1 字串
export function checkStringNotBlankOrNull(value: string): boolean {
  return value === '' || value.trim().length > 0
}

export function checkGreaterCurrentTime(value: number | null): boolean {
  return value > Date.now()
}

// 檢查給定是否是 null 若有值，檢查時間戳是否大於當前時間
export function checkGreaterCurrentTimeOrNull(value: number | null): boolean {
  if (value === null) {
    return true
  }
  return value > Date.now()
}
// 檢查僅能大於 0 以上數字
export function numberIsGreaterThanZero(value: number): boolean {
  return value > 0
}
