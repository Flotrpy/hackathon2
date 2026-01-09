
import React from 'react';
import { DisasterType, Severity } from './types';

export const DISASTER_ICONS: Record<DisasterType, React.ReactNode> = {
  [DisasterType.EARTHQUAKE]: <i className="fa-solid fa-house-crack"></i>,
  [DisasterType.FLOOD]: <i className="fa-solid fa-house-flood-water"></i>,
  [DisasterType.WILDFIRE]: <i className="fa-solid fa-fire"></i>,
  [DisasterType.HURRICANE]: <i className="fa-solid fa-tornado"></i>,
  [DisasterType.TORNADO]: <i className="fa-solid fa-wind"></i>,
  [DisasterType.VOLCANO]: <i className="fa-solid fa-volcano"></i>,
  [DisasterType.TSUNAMI]: <i className="fa-solid fa-water"></i>,
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  [Severity.LOW]: 'text-blue-400',
  [Severity.MODERATE]: 'text-yellow-400',
  [Severity.HIGH]: 'text-orange-500',
  [Severity.CRITICAL]: 'text-red-500',
};

export const INITIAL_RECORDS: any[] = [
  {
    id: '1',
    type: DisasterType.EARTHQUAKE,
    location: 'California, USA',
    coordinates: [36.7783, -119.4179],
    severity: Severity.MODERATE,
    date: '2024-05-15',
    description: 'A magnitude 4.5 earthquake struck near the San Andreas fault.',
    reportedBy: 'Admin'
  },
  {
    id: '2',
    type: DisasterType.FLOOD,
    location: 'Rio Grande, Brazil',
    coordinates: [-30.0346, -51.2177],
    severity: Severity.CRITICAL,
    date: '2024-05-10',
    description: 'Severe flooding due to heavy rainfall causing massive displacement.',
    reportedBy: 'Admin'
  }
];
