// WLKATA Robot Types

export interface RobotPosition {
  x: number;
  y: number;
  z: number;
  rx?: number;
  ry?: number;
  rz?: number;
}

export interface JointAngles {
  joint1: number;
  joint2: number;
  joint3: number;
  joint4: number;
  joint5?: number;
  joint6?: number;
}

export interface RobotStatus {
  connected: boolean;
  homed: boolean;
  mode: 'joint' | 'coordinate' | 'idle';
  currentPosition: RobotPosition;
  jointAngles: JointAngles;
  errorCode?: string;
  errorMessage?: string;
}

export interface RobotCommand {
  type: 'move' | 'home' | 'grip' | 'release' | 'stop' | 'pause' | 'resume';
  position?: RobotPosition;
  jointAngles?: JointAngles;
  speed?: number;
  gripperState?: boolean;
}

export interface RobotResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
