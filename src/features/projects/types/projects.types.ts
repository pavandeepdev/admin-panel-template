// FILE: src/features/projects/types/index.ts

export interface Project {
  id: string
  title: string
  description: string
  site_id: string
  site_location_id: string
  date: string
  machine_id: string
  area_to_cover_ha: string
  operator_id: string
  job_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' // Assuming other statuses
  created_at: string
  updated_at: string
  // Assume nested data for display in the table
  site?: { site_name: string }
  site_location?: { site_location_name: string }
  machine?: { machine_name: string }
  operator?: { name: string }
  priority: 'low' | 'medium' | 'high'
}

export interface ProjectForm {
  title: string
  description: string
  site_id: string
  site_location_id: string
  date: string
  machine_id: string
  area_to_cover_ha: string
  operator_id: string
  job_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export interface ProjectsResponse {
  docs: Project[]
  count: number
}

// FILE: src/features/jobs/types/index.ts

// Represents a single material selected in the form
export interface JobMaterial {
  material_id: string
  spread_rate: string
  tolerance: string
}

// Main Job interface (from API)
export interface Job {
  job_id: string // Renamed from project_id for clarity
  title?: string
  site_id: string
  site_location_id: string
  date_started: string
  description: string
  area_to_cover_ha: string
  priority: 'low' | 'medium' | 'high' // Assuming priority values
  machine_id: string
  operator_id: string
  job_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  materials: JobMaterial[] // Materials is now an array
  unit_of_measure_id: string
  // ... other fields like created_at
}

// Form payload to send to the API
export interface JobForm {
  title?: string
  site_id: string
  site_location_id: string
  date: string
  description: string
  area_to_cover_ha: string
  priority: 'low' | 'medium' | 'high'
  machine_id: string
  operator_id: string
  job_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  project_materials: JobMaterial[]
}

export interface JobsResponse {
  docs: Job[]
  count: number
}
