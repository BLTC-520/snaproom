# Snaproom UI/UX Guide

The new Snaproom interface provides a streamlined, user-friendly experience for turning photos into walkable 3D worlds.

## User Flow

### 1. Welcome Screen
- **URL**: `/` (when no worlds exist or in production mode)
- **Purpose**: Introduces Snaproom and its capabilities
- **Actions**: 
  - "Create Your 3D Room" → Upload Interface
  - View recent rooms (if any)
  - See how it works demo

### 2. Upload Interface  
- **Purpose**: Upload photos/floorplans and name your room
- **Features**:
  - Drag & drop or click to browse files
  - Auto-detection of photos vs floorplans
  - Manual toggle between photo/floorplan types
  - Room naming
  - Upload tips and guidelines
- **Actions**:
  - "Create 3D Room" → Processing Interface
  - Cancel → Welcome Screen

### 3. Processing Interface
- **Purpose**: Shows real-time processing progress
- **Features**:
  - 5-step processing visualization
  - Estimated time for each step
  - Progress bar and status indicators  
  - Educational content while waiting
- **Steps**:
  1. Uploading Images (30s)
  2. Analyzing Room Structure (2-3 min)
  3. Building 3D Environment (3-4 min)  
  4. Generating 3D Objects (2-3 min)
  5. Adding Ambient Sounds (1-2 min)
- **Actions**:
  - Auto-redirect to Room Explorer when complete
  - Cancel → Welcome Screen

### 4. Room Explorer
- **Purpose**: Navigate and explore the generated 3D room
- **Features**:
  - Clean, immersive interface
  - Contextual controls that can be hidden
  - Keyboard shortcuts for power users
  - Room info and sharing options

#### Controls:
- **Navigation**: 
  - Mouse/Touch: Look around
  - WASD/Arrow Keys: Move
  - Scroll/Pinch: Zoom
- **Modes**:
  - Fly Mode: Free camera movement
  - Walk Mode: First-person walking
- **UI**:
  - Top: Room name and action buttons
  - Bottom Left: Control toggles
  - Bottom Right: Hide/show UI
- **Keyboard Shortcuts**:
  - `C`: Switch control mode
  - `M`: Toggle audio
  - `Q`: Toggle quality
  - `U`: Toggle UI visibility
  - `H`: Toggle help panel

## Developer Mode

When in development mode (`import.meta.env.DEV`) and worlds exist in the `/worlds` directory, the app falls back to the original developer interface for Claude Code integration.

## Integration Points

The new interface is designed to integrate with:

1. **File Upload API**: Handle photo/floorplan uploads
2. **Processing Pipeline**: Trigger world generation with Claude skills
3. **World Storage**: Save generated worlds to `/worlds` directory
4. **Sharing System**: Generate shareable links for rooms
5. **Recent Rooms**: Persist user's created rooms

## Technical Notes

- All interfaces use the existing chrome design system
- State management through React useState (can be upgraded to Zustand if needed)
- Responsive design for desktop and mobile
- TypeScript for type safety
- Maintains compatibility with existing 3D viewer and world loading system

## Future Enhancements

- User accounts and room persistence
- Social sharing features
- Advanced room editing tools
- Export options for different formats
- Collaborative room exploration