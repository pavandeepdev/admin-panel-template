import { useEffect, useState } from 'react'
import { CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateTimePickerProps {
  date: Date | null
  onDateChange: (date: Date) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}

// Format date as "September 16th, 2025"
const formatDateWithOrdinal = (date: Date): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`
}

// Format time in 12-hour format
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Format complete datetime
const formatDateTime = (date: Date): string => {
  return `${formatDateWithOrdinal(date)} at ${formatTime(date)}`
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = 'Select date and time',
  label,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(
    date ? date.toTimeString().slice(0, 5) : '12:00'
  )

  useEffect(() => {
    if (date) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}`)
    }
  }, [date])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':')
      const newDate = new Date(selectedDate)
      newDate.setHours(parseInt(hours), parseInt(minutes))
      onDateChange(newDate)
      setOpen(false)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)

    if (date && newTime.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = newTime.split(':').map(Number)

      const newDate = new Date(date)
      newDate.setHours(hours, minutes)
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate)
      }
    }
  }

  // Function to disable past dates in calendar
  const disablePastDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Function to check if selected date is today
  const isToday = (selectedDate: Date | null) => {
    if (!selectedDate) return false
    const today = new Date()
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }

  // Function to check if current time should be disabled
  const isTimeDisabled = () => {
    if (!date) return false

    // If selected date is today, check if selected time is in the past
    if (isToday(date)) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      const [selectedHours, selectedMinutes] = time.split(':').map(Number)
      const selectedTime = selectedHours * 60 + selectedMinutes

      return selectedTime < currentTime
    }

    return false
  }

  // Get minimum time for today
  const getMinTime = () => {
    if (date && isToday(date)) {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return undefined
  }

  return (
    <div className='space-y-2'>
      {label && (
        <label className='text-foreground text-sm font-medium'>{label}</label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='h-9 w-full min-w-0 justify-between text-left font-normal'
            disabled={disabled}
          >
            <span
              className={cn(
                'block flex-1 truncate pr-3 text-left',
                date ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {/* FIX: Check if date is truthy AND is a valid date object */}
              {date && !isNaN(date.getTime())
                ? formatDateTime(date)
                : placeholder}
            </span>
            <CalendarIcon className='text-muted-foreground h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <div className='space-y-4'>
            <Calendar
              mode='single'
              selected={date || undefined}
              onSelect={handleDateSelect}
              disabled={disablePastDates} // This will disable past dates
              initialFocus
            />
            <div className='border-t px-3 pt-3 pb-3'>
              <div className='flex items-center space-x-2'>
                <Clock className='text-muted-foreground h-4 w-4' />
                <Input
                  type='time'
                  value={time}
                  min={getMinTime()} // Set minimum time for today
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className='flex-1'
                  disabled={disabled}
                />
              </div>
              {isTimeDisabled() && (
                <p className='mt-2 text-sm text-red-500'>
                  Please select a future time
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
