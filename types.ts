
export enum DisasterType {
  EARTHQUAKE = 'Earthquake',
  FLOOD = 'Flood',
  WILDFIRE = 'Wildfire',
  HURRICANE = 'Hurricane',
  TORNADO = 'Tornado',
  VOLCANO = 'Volcano',
  TSUNAMI = 'Tsunami'
}

export enum Severity {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface DisasterRecord {
  id: string;
  type: DisasterType;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  severity: Severity;
  date: string;
  description: string;
  reportedBy: string;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export interface SafetyTip {
  title: string;
  description: string;
}
