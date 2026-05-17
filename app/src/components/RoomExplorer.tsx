import { useState, useCallback } from 'react'
import * as React from 'react'
import { Upload, Share, Gear, Eye, EyeSlash, SpeakerHigh, SpeakerSlash, ArrowsOut, Question } from '@phosphor-icons/react'
import { AppButton } from './AppButton'
import { useAudioStore } from '../store/audio'
import { useDebugStore, type ControllerMode } from '../store/debug'
import { ViewerQuality } from '../types/world'

interface Props {
  roomName: string
  roomSlug: string
  onNewRoom: () => void
  onShareRoom?: () => void
  children?: React.ReactNode
}

const CONTROLLER_MODES: readonly { mode: ControllerMode; label: string }[] = [
  { mode: 'fly', label: 'Fly' },
  { mode: 'fps', label: 'Walk' },
]

const QUALITY_MODES = [
  { mode: ViewerQuality.Low, label: 'Low' },
  { mode: ViewerQuality.High, label: 'High' },
] as const

function nextMode<T>(items: readonly { mode: T }[], current: T) {
  const index = items.findIndex((item) => item.mode === current)
  return items[(index + 1) % items.length].mode
}

export function RoomExplorer({ roomName, onNewRoom, onShareRoom, children }: Props) {
  const [showControls, setShowControls] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  
  const muted = useAudioStore((s) => s.muted)
  const toggleMuted = useAudioStore((s) => s.toggleMuted)
  const controllerMode = useDebugStore((s) => s.controllerMode)
  const setControllerMode = useDebugStore((s) => s.setControllerMode)
  const viewerQuality = useDebugStore((s) => s.viewerQuality)
  const setViewerQuality = useDebugStore((s) => s.setViewerQuality)

  const currentControllerMode = CONTROLLER_MODES.find(item => item.mode === controllerMode) ?? CONTROLLER_MODES[0]
  const currentQuality = QUALITY_MODES.find(item => item.mode === viewerQuality) ?? QUALITY_MODES[0]

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.target && (e.target as Element).tagName === 'INPUT') return
    
    switch (e.key.toLowerCase()) {
      case 'h':
        setShowHelp(prev => !prev)
        break
      case 'u':
        setShowControls(prev => !prev)
        break
      case 'm':
        toggleMuted()
        break
      case 'c':
        setControllerMode(nextMode(CONTROLLER_MODES, controllerMode))
        break
      case 'q':
        setViewerQuality(nextMode(QUALITY_MODES, viewerQuality))
        break
    }
  }, [controllerMode, viewerQuality, setControllerMode, setViewerQuality, toggleMuted])

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Viewer */}
      {children}

      {/* Top Bar */}
      {showControls && (
        <div className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between gap-3 md:left-4 md:right-4 md:top-4">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-black/55 px-4 py-3 backdrop-blur-md">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-black/35">
              <div className="h-4 w-4 rounded-sm bg-[var(--accent)]" />
            </div>
            <span className="text-white font-semibold">{roomName}</span>
          </div>
          
          <div className="flex gap-2">
            <AppButton
              onClick={onNewRoom}
              className="hidden items-center gap-2 rounded-lg border border-[var(--line)] bg-black/45 px-3 py-2 text-white backdrop-blur-sm hover:bg-black/70 sm:inline-flex"
            >
              <Upload size={16} />
              New Room
            </AppButton>
            
            {onShareRoom && (
              <AppButton
                onClick={onShareRoom}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-black/45 px-3 py-2 text-white backdrop-blur-sm hover:bg-black/70"
              >
                <Share size={16} />
                <span className="hidden sm:inline">Share</span>
              </AppButton>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
          {/* Movement Mode */}
          <AppButton
            onClick={() => setControllerMode(nextMode(CONTROLLER_MODES, controllerMode))}
            className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-black/45 px-3 py-2 text-sm text-white backdrop-blur-sm hover:bg-black/70"
          >
            <ArrowsOut size={16} />
            {currentControllerMode.label}
          </AppButton>

          {/* Audio */}
          <AppButton
            onClick={toggleMuted}
            className="rounded-lg border border-[var(--line)] bg-black/45 p-2 text-white backdrop-blur-sm hover:bg-black/70"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <SpeakerSlash size={16} /> : <SpeakerHigh size={16} />}
          </AppButton>

          {/* Quality */}
          <AppButton
            onClick={() => setViewerQuality(nextMode(QUALITY_MODES, viewerQuality))}
            className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-black/45 px-3 py-2 text-sm text-white backdrop-blur-sm hover:bg-black/70"
          >
            <Gear size={16} />
            {currentQuality.label}
          </AppButton>

          {/* Help */}
          <AppButton
            onClick={() => setShowHelp(prev => !prev)}
            className="rounded-lg border border-[var(--line)] bg-black/45 p-2 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <Question size={16} />
          </AppButton>
        </div>
      )}

      {/* Hide UI Toggle */}
      <div className="absolute bottom-4 right-4 z-30">
        <AppButton
          onClick={() => setShowControls(prev => !prev)}
          className="rounded-lg border border-[var(--line)] bg-black/45 p-2 text-white backdrop-blur-sm hover:bg-black/70"
          title={showControls ? 'Hide Controls' : 'Show Controls'}
        >
          {showControls ? <EyeSlash size={16} /> : <Eye size={16} />}
        </AppButton>
      </div>

      {/* Help Panel */}
      {showHelp && showControls && (
        <div className="absolute inset-4 z-40 flex items-center justify-center">
          <div className="max-h-full w-full max-w-md overflow-hidden rounded-lg border border-[var(--line)] bg-black/85 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-4">
              <h3 className="text-white font-medium">Controls</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
              <div>
                <h4 className="text-white/80 font-medium mb-2">Navigation</h4>
                <div className="space-y-1 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>Mouse/Touch</span>
                    <span>Look around</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WASD / Arrows</span>
                    <span>Move</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scroll / Pinch</span>
                    <span>Zoom</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white/80 font-medium mb-2">Shortcuts</h4>
                <div className="space-y-1 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>C</span>
                    <span>Switch mode</span>
                  </div>
                  <div className="flex justify-between">
                    <span>M</span>
                    <span>Toggle audio</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Q</span>
                    <span>Toggle quality</span>
                  </div>
                  <div className="flex justify-between">
                    <span>U</span>
                    <span>Toggle UI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>H</span>
                    <span>This help</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
