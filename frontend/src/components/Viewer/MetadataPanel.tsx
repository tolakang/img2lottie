import { LottieMetadata } from '../../hooks/useLottiePlayer'

interface MetadataPanelProps {
  metadata: LottieMetadata | null
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MetadataPanel({ metadata }: MetadataPanelProps) {
  if (!metadata) {
    return (
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold mb-3">Metadata</h3>
        <p className="text-sm text-muted-foreground">No animation loaded</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold mb-3">Metadata</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium truncate max-w-[150px]">{metadata.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dimensions</span>
          <span>{metadata.width} × {metadata.height}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Frame Rate</span>
          <span>{metadata.frameRate} fps</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Layers</span>
          <span>{metadata.layerCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Assets</span>
          <span>{metadata.assetCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">File Size</span>
          <span>{formatFileSize(metadata.fileSize)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">FEATURES</h4>
        <div className="flex flex-wrap gap-2">
          {metadata.hasExpressions && (
            <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-500 rounded">Expressions</span>
          )}
          {metadata.hasMasks && (
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-500 rounded">Masks</span>
          )}
          {metadata.hasMattes && (
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-500 rounded">Mattes</span>
          )}
          {(!metadata.hasExpressions && !metadata.hasMasks && !metadata.hasMattes) && (
            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded">Standard</span>
          )}
        </div>
      </div>
    </div>
  )
}
