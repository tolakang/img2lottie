import { Router, Request, Response } from 'express'

const router = Router()

router.post('/convert', async (req: Request, res: Response) => {
  try {
    const { image, format, filename } = req.body

    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    const isSvg = format === 'image/svg+xml' || filename?.endsWith('.svg')
    
    let lottieJson: any

    if (isSvg) {
      lottieJson = convertSvgToLottie(image)
    } else {
      lottieJson = await convertRasterToLottie(image, format)
    }

    res.json({
      success: true,
      lottieJson,
      metadata: {
        width: lottieJson.w,
        height: lottieJson.h,
        frameRate: lottieJson.fr,
        layerCount: lottieJson.layers?.length || 0,
      },
    })
  } catch (error) {
    console.error('Conversion error:', error)
    res.status(500).json({ error: 'Conversion failed' })
  }
})

function convertSvgToLottie(svgBase64: string): any {
  const svgContent = Buffer.from(svgBase64, 'base64').toString('utf-8')
  
  const widthMatch = svgContent.match(/width=["'](\d+)/)
  const heightMatch = svgContent.match(/height=["'](\d+)/)
  const viewBoxMatch = svgContent.match(/viewBox=["'][\d\s]*\s([\d.]+)\s+([\d.]+)["']/)
  
  let width = widthMatch ? parseInt(widthMatch[1]) : 512
  let height = heightMatch ? parseInt(heightMatch[1]) : 512
  
  if (viewBoxMatch && !widthMatch) {
    width = Math.round(parseFloat(viewBoxMatch[1]))
    height = Math.round(parseFloat(viewBoxMatch[2]))
  }

  const hasAnimatedElements = svgContent.includes('<animate') || 
                              svgContent.includes('<animateTransform') ||
                              svgContent.includes('<set')

  if (hasAnimatedElements) {
    return createAnimatedLottie(width, height)
  }

  return createStaticLottie(width, height)
}

async function convertRasterToLottie(base64Data: string, format: string): Promise<any> {
  return createStaticLottie(512, 512)
}

function createStaticLottie(width: number, height: number) {
  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 60,
    w: width,
    h: height,
    nm: 'Converted Animation',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Shape Layer 1',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [width / 2, height / 2, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: 'rc',
            d: 1,
            s: { a: 0, k: [200, 200] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 },
            nm: 'Rectangle Path 1',
          },
          {
            ty: 'fl',
            c: { a: 0, k: [0.267, 0.447, 1, 1] },
            o: { a: 0, k: 100 },
            nm: 'Fill 1',
          },
        ],
        ip: 0,
        op: 60,
        st: 0,
        bm: 0,
      },
    ],
  }
}

function createAnimatedLottie(width: number, height: number) {
  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 90,
    w: width,
    h: height,
    nm: 'Animated Conversion',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Animated Shape',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: {
            a: 1,
            k: [
              { t: 0, s: [0], e: [360] },
              { t: 90, s: [360] },
            ],
          },
          p: { a: 0, k: [width / 2, height / 2, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
              { t: 45, s: [120, 120, 100], e: [100, 100, 100] },
              { t: 90, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'el',
            s: { a: 0, k: [150, 150] },
            p: { a: 0, k: [0, 0] },
            nm: 'Ellipse Path 1',
          },
          {
            ty: 'fl',
            c: {
              a: 1,
              k: [
                { t: 0, s: [0.267, 0.447, 1, 1], e: [1, 0.267, 0.447, 1] },
                { t: 45, s: [1, 0.267, 0.447, 1], e: [0.267, 1, 0.447, 1] },
                { t: 90, s: [0.267, 1, 0.447, 1] },
              ],
            },
            o: { a: 0, k: 100 },
            nm: 'Fill 1',
          },
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0,
      },
    ],
  }
}

export default router
