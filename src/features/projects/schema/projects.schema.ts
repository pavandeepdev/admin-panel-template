// FILE: src/features/jobs/schema/project.schema.ts
import { z } from 'zod'

// Schema for a single material entry in the form
const materialSchema = z.object({
  material_id: z.string().min(1, 'Please select a material.'),
  spread_rate: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a number.'),
  tolerance: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a number.'),
})

/*
  // HIGHLIGHT: The schema is now complete and matches all the fields in your form.
*/
export const jobFormScheme = z.object({
  title: z.string().optional(),
  site_id: z.string().min(1, { message: 'Please select a site.' }),
  site_location_id: z.string().min(1, { message: 'Please select a location.' }),
  date_started: z.date({ required_error: 'Please select a start date.' }),
  machine_id: z.string().min(1, { message: 'Please select a machine.' }),
  operator_id: z.string().min(1, { message: 'Please select an operator.' }),
  // Added the missing fields
  area_to_cover_ha: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Area must be a positive number.',
    }),
  // This was missing from your form component, so I'm commenting it out based on the latest form code.
  // If you need it, uncomment it and add the field to the form.
  // unit_of_measure_id: z.string().min(1, { message: 'Please select a unit of measure.' }),
  description: z
    .string()
    .max(255, { message: 'Description cannot exceed 255 characters.' })
    .optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority.',
  }),
  job_status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']), // Assuming you add these options back
  materials: z
    .array(materialSchema)
    .min(1, 'Please add at least one material.'),
})

export type TJobFormSchema = z.infer<typeof jobFormScheme>