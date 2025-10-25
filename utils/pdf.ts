export async function computePageSizes(pdfDoc: any, thumbScale = 0.6, scrollScale = 1.2) {
  const thumbMap: Record<number, { width: number; height: number }> = {}
  const scrollMap: Record<number, { width: number; height: number }> = {}
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    try {
      const page = await pdfDoc.getPage(i)
      const thumbViewport = page.getViewport({ scale: thumbScale })
      const scrollViewport = page.getViewport({ scale: scrollScale })
      thumbMap[i] = { width: Math.round(thumbViewport.width), height: Math.round(thumbViewport.height) }
      scrollMap[i] = { width: Math.round(scrollViewport.width), height: Math.round(scrollViewport.height) }
    } catch (e) {
      // ignore individual page errors
    }
  }
  return { thumbMap, scrollMap }
}
