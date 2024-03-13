/**
 * @description 判断是否空值
 * @param value 值
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined || value === "" || isNaN(value)) {
    return true
  }
  return false
}

