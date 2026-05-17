import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Gear, Globe, Cube, SpeakerHigh, Eye } from '@phosphor-icons/react'
import { AppButton } from './AppButton'
import { chrome } from './AppChrome'

interface ProcessingStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  icon: React.ReactNode
  estimatedTime?: string
}

interface Props {
  roomName: string
  fileCount: number
  onComplete: (roomSlug: string) => void
  onCancel?: () => void
}

export function ProcessingInterface({ roomName, fileCount, onComplete, onCancel }: Props) {
  const [, setCurrentStepIndex] = useState(0)
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'upload',
      title: 'Uploading Images',
      description: 'Sending your photos to our processing servers',
      status: 'running',
      icon: <Globe size={20} />,
      estimatedTime: '30s'
    },
    {
      id: 'analysis',
      title: 'Analyzing Room Structure',
      description: 'Understanding the layout and identifying objects',
      status: 'pending',
      icon: <Eye size={20} />,
      estimatedTime: '2-3 min'
    },
    {
      id: 'world',
      title: 'Building 3D Environment',
      description: 'Creating the walkable 3D space and textures',
      status: 'pending',
      icon: <Cube size={20} />,
      estimatedTime: '3-4 min'
    },
    {
      id: 'objects',
      title: 'Generating 3D Objects',
      description: 'Creating furniture and object models',
      status: 'pending',
      icon: <Gear size={20} />,
      estimatedTime: '2-3 min'
    },
    {
      id: 'audio',
      title: 'Adding Ambient Sounds',
      description: 'Generating room-appropriate audio atmosphere',
      status: 'pending',
      icon: <SpeakerHigh size={20} />,
      estimatedTime: '1-2 min'
    }
  ])

  // Simulate processing steps
  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Update current step to running
        setCurrentStepIndex(i)
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'running' : index < i ? 'completed' : 'pending'
        })))

        // Simulate processing time
        const baseTime = [2000, 4000, 6000, 5000, 3000][i] // Different times for each step
        const randomVariation = Math.random() * 2000 + 1000
        const totalTime = baseTime + randomVariation

        await new Promise(resolve => setTimeout(resolve, totalTime))

        // Mark step as completed
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : 'pending'
        })))
      }

      // All steps completed, generate room slug and navigate
      const roomSlug = roomName.toLowerCase()
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .slice(0, 30)
      
      // Small delay before completing
      setTimeout(() => onComplete(roomSlug), 1000)
    }

    processSteps()
  }, [roomName, onComplete])

  const totalEstimatedTime = "8-13 minutes"
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className={`${chrome.enter} w-full max-w-2xl`}>
        {/* Header */}
        <div className={`${chrome.bar} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-mono">Creating your 3D room...</h1>
              <p className="text-white/60 text-sm mt-1">
                {roomName} • {fileCount} images • Est. {totalEstimatedTime}
              </p>
            </div>
          </div>
        </div>

        <div className={`${chrome.panel} p-6`}>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/80">
                Progress
              </span>
              <span className="text-sm text-white/60">
                {completedSteps} of {steps.length} steps
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`
                  flex items-start gap-4 p-4 rounded-lg transition-all duration-300
                  ${step.status === 'running' 
                    ? 'bg-white/10 border border-white/20' 
                    : step.status === 'completed'
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-white/5 border border-white/10'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${step.status === 'running'
                    ? 'bg-white/20 text-white animate-pulse'
                    : step.status === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-white/10 text-white/40'
                  }
                `}>
                  {step.status === 'completed' ? (
                    <CheckCircle size={20} weight="fill" />
                  ) : step.status === 'running' ? (
                    <div className="animate-spin">
                      {step.icon}
                    </div>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`
                      font-medium
                      ${step.status === 'completed' 
                        ? 'text-green-400' 
                        : step.status === 'running'
                        ? 'text-white'
                        : 'text-white/60'
                      }
                    `}>
                      {step.title}
                    </h3>
                    {step.status === 'running' && step.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Clock size={12} />
                        {step.estimatedTime}
                      </div>
                    )}
                  </div>
                  <p className={`
                    text-sm
                    ${step.status === 'completed' 
                      ? 'text-green-400/80' 
                      : step.status === 'running'
                      ? 'text-white/80'
                      : 'text-white/40'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips while waiting */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="text-sm font-medium text-white/80 mb-2">
              While you wait...
            </h3>
            <div className="text-sm text-white/60 space-y-1">
              <p>• We're using AI to reconstruct your room in full 3D</p>
              <p>• Each photo helps us understand different angles and details</p>
              <p>• The result will be a fully explorable 3D environment</p>
              <p>• You'll be able to walk around and interact with objects</p>
            </div>
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <div className="mt-6 flex justify-center">
              <AppButton
                onClick={onCancel}
                className="px-6 py-2 text-white/60 hover:text-white border border-white/20 hover:border-white/30"
              >
                Cancel Processing
              </AppButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}