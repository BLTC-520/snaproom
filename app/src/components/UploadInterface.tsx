import { useState, useCallback, useRef } from 'react'
import { Upload, Camera, House, ArrowRight, X, CheckCircle } from '@phosphor-icons/react'
import { AppButton } from './AppButton'
import { chrome } from './AppChrome'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'photo' | 'floorplan'
}

interface Props {
  onStartProcessing: (files: UploadedFile[], roomName: string) => void
  onCancel?: () => void
}

export function UploadInterface({ onStartProcessing, onCancel }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [roomName, setRoomName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = []
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)
        
        // Simple heuristic to detect floorplans vs photos
        const isFloorplan = file.name.toLowerCase().includes('floor') || 
                           file.name.toLowerCase().includes('plan') ||
                           file.name.toLowerCase().includes('layout')
        
        newFiles.push({
          id,
          file,
          preview,
          type: isFloorplan ? 'floorplan' : 'photo'
        })
      }
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== id)
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(f => f.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }, [])

  const toggleFileType = useCallback((id: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, type: file.type === 'photo' ? 'floorplan' : 'photo' }
        : file
    ))
  }, [])

  const canStartProcessing = uploadedFiles.length > 0 && roomName.trim().length > 0

  const handleStartProcessing = useCallback(() => {
    if (canStartProcessing) {
      onStartProcessing(uploadedFiles, roomName.trim())
    }
  }, [uploadedFiles, roomName, canStartProcessing, onStartProcessing])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className={`${chrome.enter} w-full max-w-4xl`}>
        {/* Header */}
        <div className={`${chrome.bar} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-mono">snaproom</h1>
              <p className="text-white/60 text-sm mt-1">
                Turn photos of any room into a walkable 3D world
              </p>
            </div>
            {onCancel && (
              <AppButton
                onClick={onCancel}
                className="h-8 w-8 justify-center p-1 text-white/60"
                aria-label="Cancel"
              >
                <X size={16} weight="regular" />
              </AppButton>
            )}
          </div>
        </div>

        <div className={`${chrome.panel} p-6 space-y-6`}>
          {/* Room Name Input */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., Living Room, Bedroom, Kitchen..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
            />
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Upload Photos or Floorplans
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragOver 
                  ? 'border-white/40 bg-white/5' 
                  : 'border-white/20 hover:border-white/30'
                }
              `}
            >
              <Upload size={48} className="mx-auto text-white/40 mb-4" />
              <p className="text-white/60 mb-2">
                Drag & drop images here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white underline hover:text-white/80"
                >
                  browse files
                </button>
              </p>
              <p className="text-white/40 text-sm">
                Supports JPG, PNG, HEIC. Multiple angles work best.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Uploaded Images ({uploadedFiles.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* File Type Toggle */}
                    <button
                      onClick={() => toggleFileType(file.id)}
                      className={`
                        absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium transition-colors
                        ${file.type === 'photo' 
                          ? 'bg-blue-500/80 text-white' 
                          : 'bg-green-500/80 text-white'
                        }
                      `}
                    >
                      {file.type === 'photo' ? (
                        <>
                          <Camera size={12} className="inline mr-1" />
                          Photo
                        </>
                      ) : (
                        <>
                          <House size={12} className="inline mr-1" />
                          Plan
                        </>
                      )}
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>

                    {/* File Name */}
                    <p className="text-xs text-white/60 mt-1 truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white/80 mb-2">Tips for best results:</h3>
            <ul className="text-sm text-white/60 space-y-1">
              <li>• Take photos from multiple angles and corners</li>
              <li>• Include furniture and objects in your shots</li>
              <li>• Good lighting helps - avoid very dark images</li>
              <li>• Floorplans help define room layout and dimensions</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <AppButton
              onClick={handleStartProcessing}
              disabled={!canStartProcessing}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 font-medium
                ${canStartProcessing 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
            >
              <CheckCircle size={18} />
              Create 3D Room
              <ArrowRight size={18} />
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  )
}