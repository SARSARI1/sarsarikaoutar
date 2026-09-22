export function driveIdFromUrl(url = '') {
  const m = url.match(/\/d\/([^/]+)/)
  return m ? m[1] : null
}

export function driveEmbedUrl(url = '') {
  const id = driveIdFromUrl(url)
  return id ? `https://drive.google.com/file/d/${id}/preview` : null
}
