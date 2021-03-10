export const isURI = (str: string): boolean => {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
}

export const slugReg = /[^a-z0-9]/gi

export const disallowedSlugs = ["", "@/create"]
