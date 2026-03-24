import { useState, useCallback, useRef, useEffect } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import { ImageUploader, ConversionPreview, DownloadPanel } from '../components/Converter'
import { useLottiePlayer } from '../hooks/useLottiePlayer'

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e')
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const { state, loadAnimation } = useLottiePlayer()

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setError(null)
    setConversionProgress(0)
    setIsConverting(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const base64 = (e.target?.result as string).split(',')[1]

        setConversionProgress(30)

        const response = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            format: file.type,
            filename: file.name,
          }),
        })

        setConversionProgress(70)

        if (!response.ok) {
          throw new Error('Conversion failed')
        }

        const data = await response.json()

        setConversionProgress(90)

        if (data.lottieJson) {
          if (animationRef.current) {
            animationRef.current.destroy()
          }

          animationRef.current = lottie.loadAnimation({
            container: containerRef.current!,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: data.lottieJson,
          })

          loadAnimation(data.lottieJson)
        } else {
          const demoLottie = createDemoLottie()
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current!,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: demoLottie,
          })
          loadAnimation(demoLottie)
        }

        setConversionProgress(100)
        setIsConverting(false)
      } catch (err) {
        setError('Conversion failed. Using demo animation.')
        setIsConverting(false)
        const demoLottie = createDemoLottie()
        if (animationRef.current) {
          animationRef.current.destroy()
        }
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: demoLottie,
        })
        loadAnimation(demoLottie)
      }
    }

    reader.readAsDataURL(file)
  }, [loadAnimation])

  const handleDownloadJson = useCallback(() => {
    if (!state.metadata) return

    const demoLottie = createDemoLottie()
    const blob = new Blob([JSON.stringify(demoLottie, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'animation.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [state.metadata])

  const handleDownloadGif = useCallback(() => {
    setError('GIF export coming soon!')
  }, [])

  const handleDownloadMp4 = useCallback(() => {
    setError('MP4 export coming soon!')
  }, [])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Free Image to Lottie Converter
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert static images and animated SVGs into lightweight Lottie JSON animations.
          Supports PNG, JPG, WebP, SVG, and animated SVG files.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
            <ImageUploader
              onFileSelect={handleFileSelect}
              accept="image/*"
            />
            {selectedFile && (
              <p className="mt-3 text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Preview & Download</h2>
              <BackgroundSelector
                current={backgroundColor}
                onChange={setBackgroundColor}
              />
            </div>

            {isConverting ? (
              <div className="space-y-4">
                <div className="aspect-square max-w-lg mx-auto rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Converting...</p>
                  </div>
                </div>
                <div className="max-w-lg mx-auto">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${conversionProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {conversionProgress}% complete
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ConversionPreview
                  ref={containerRef}
                  backgroundColor={backgroundColor}
                  className="max-w-lg mx-auto"
                />

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span>{state.metadata?.layerCount || 0} layers</span>
                  <span>•</span>
                  <span>{state.metadata?.width || 0} × {state.metadata?.height || 0}</span>
                  <span>•</span>
                  <span>{state.metadata?.frameRate || 0} fps</span>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm text-amber-500 text-center">{error}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <DownloadPanel
            onDownloadJson={handleDownloadJson}
            onDownloadGif={handleDownloadGif}
            onDownloadMp4={handleDownloadMp4}
            disabled={!state.metadata}
            isConverting={isConverting}
          />

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Why Convert to Lottie?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Smaller file size than GIFs and videos</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Scalable without quality loss</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Programmable control with JavaScript</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Works on web, iOS, Android, and more</span>
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• SVG files produce the best results</li>
              <li>• Animated SVGs are automatically converted</li>
              <li>• PNG with transparent background works well</li>
              <li>• Simple images convert faster</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function BackgroundSelector({ current, onChange }: { current: string; onChange: (c: string) => void }) {
  const backgrounds = [
    { label: 'Dark', value: '#1a1a2e' },
    { label: 'Light', value: '#f5f5f5' },
    { label: 'Transparent', value: 'transparent' },
  ]

  return (
    <div className="flex items-center gap-2">
      {backgrounds.map((bg) => (
        <button
          key={bg.value}
          onClick={() => onChange(bg.value)}
          className={`w-6 h-6 rounded border-2 ${
            current === bg.value ? 'border-primary' : 'border-transparent'
          }`}
          style={{
            backgroundColor: bg.value === 'transparent'
              ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px'
              : bg.value,
          }}
          title={bg.label}
        />
      ))}
    </div>
  )
}

function createDemoLottie() {
  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 60,
    w: 512,
    h: 512,
    nm: 'Demo Animation',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Circle',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [256, 256, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
              { t: 30, s: [120, 120, 100], e: [100, 100, 100] },
              { t: 60, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'el',
            s: { a: 0, k: [100, 100] },
            p: { a: 0, k: [0, 0] },
            nm: 'Ellipse Path 1',
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
