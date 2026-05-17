import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Unconsumed look deltas (radians) accumulated from the phone's motion sensor.
 * A camera controller reads this each frame, applies the deltas, then zeroes
 * them. `active` flips true once any sample arrives — i.e. we're running inside
 * the Snaproom mobile app's WebView.
 */
export interface DeviceLook {
  yaw: number
  pitch: number
  active: boolean
}

const DEG2RAD = Math.PI / 180

// Scratch objects — module scope so the per-sample handler allocates nothing.
const _zee = new THREE.Vector3(0, 0, 1)
const _euler = new THREE.Euler()
const _q0 = new THREE.Quaternion()
const _q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)) // -90° about X
const _quat = new THREE.Quaternion()
const _forward = new THREE.Vector3()

/**
 * Convert a W3C-style device orientation (radians) plus screen orientation
 * into the world-space yaw/pitch the phone's back points at. This is the
 * standard three.js DeviceOrientationControls construction.
 */
function lookFromDevice(alpha: number, beta: number, gamma: number, screenRad: number) {
  _euler.set(beta, alpha, -gamma, 'YXZ')
  _quat.setFromEuler(_euler)
  _quat.multiply(_q1) // the camera looks out the back of the device
  _quat.multiply(_q0.setFromAxisAngle(_zee, -screenRad))
  _forward.set(0, 0, -1).applyQuaternion(_quat)
  return {
    yaw: Math.atan2(-_forward.x, -_forward.z),
    pitch: Math.asin(Math.max(-1, Math.min(1, _forward.y))),
  }
}

/** Shortest signed difference between two angles, in (-π, π]. */
function wrapAngle(value: number) {
  return ((value + Math.PI * 3) % (Math.PI * 2)) - Math.PI
}

/**
 * Listens for device-orientation samples injected by the Snaproom mobile app
 * (`snaproom:orientation` window events) and turns them into incremental
 * yaw/pitch look deltas. Inert in a normal browser — no events, no effect.
 *
 * Deltas (not absolute angles) are used so phone-look composes cleanly with
 * touch/mouse look and never snaps the camera when it engages.
 */
export function useDeviceOrientationLook() {
  const look = useRef<DeviceLook>({ yaw: 0, pitch: 0, active: false })

  useEffect(() => {
    let previous: { yaw: number; pitch: number } | null = null

    const onOrientation = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (!detail) return
      const { yaw, pitch } = lookFromDevice(
        detail.alpha ?? 0,
        detail.beta ?? 0,
        detail.gamma ?? 0,
        (detail.orientation ?? 0) * DEG2RAD,
      )
      if (previous) {
        look.current.yaw += wrapAngle(yaw - previous.yaw)
        look.current.pitch += pitch - previous.pitch
      }
      previous = { yaw, pitch }
      look.current.active = true
    }
    // Drop the baseline so the next sample yields no delta — used after a
    // WebView reload or an explicit recenter.
    const onReset = () => {
      previous = null
    }

    window.addEventListener('snaproom:orientation', onOrientation)
    window.addEventListener('snaproom:recenter', onReset)
    return () => {
      window.removeEventListener('snaproom:orientation', onOrientation)
      window.removeEventListener('snaproom:recenter', onReset)
    }
  }, [])

  return look
}
