export const isURI = (str: string): boolean => {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
}
