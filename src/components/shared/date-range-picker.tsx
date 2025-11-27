import { useEffect, useState } from 'react'
import {
  format,
  // addMonths,
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface DateRangePickerProps {
  className?: string
  selected?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

const presets: { label: string; getRange: () => DateRange }[] = [
  {
    label: 'Today',
    getRange: () => ({
      from: startOfToday(),
      to: endOfToday(),
    }),
  },
  {
    label: 'Yesterday',
    getRange: () => ({
      from: startOfYesterday(),
      to: endOfYesterday(),
    }),
  },
  {
    label: 'This Week',
    getRange: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: 'Last Week',
    getRange: () => {
      const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), {
        weekStartsOn: 1,
      })
      const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), {
        weekStartsOn: 1,
      })
      return { from: lastWeekStart, to: lastWeekEnd }
    },
  },
  {
    label: 'This Month',
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Last Month',
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    },
  },
  {
    label: 'Last 3 Months',
    getRange: () => ({
      from: startOfMonth(subMonths(new Date(), 2)),
      to: endOfMonth(new Date()),
    }),
  },
]

export function DateRangePicker({
  className,
  selected,
  onChange,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = useState<DateRange | undefined>(
    selected
  )

  const [displayMonth, setDisplayMonth] = useState<Date>(
    selected?.from ?? new Date()
  )

  // REMOVE: We are using the Calendar's built-in dropdowns now
  // const [showMonthPicker, setShowMonthPicker] = useState(false)
  // const [yearOffset, setYearOffset] = useState(0)

  const [showCustom, setShowCustom] = useState(false)

  useEffect(() => {
    setInternalDate(selected)
    if (selected?.from) setDisplayMonth(selected.from)
  }, [selected])

  const applyRange = (range: DateRange | undefined) => {
    setInternalDate(range)
    onChange?.(range)
  }

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    applyRange(undefined)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <div className='relative w-full'>
          {/* PopoverTrigger and Button remain the same */}
          <PopoverTrigger asChild>
            <Button
              id='date'
              variant='outline'
              className={cn(
                'w-full justify-start bg-transparent text-left font-normal',
                !internalDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {internalDate?.from ? (
                internalDate.to ? (
                  <>
                    {format(internalDate.from, 'LLL dd, y')} -{' '}
                    {format(internalDate.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(internalDate.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          {internalDate && (
            <button
              type='button'
              onClick={clearDate}
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
        <PopoverContent
          className='w-[320px] p-3'
          align='start'
          side='bottom'
          sideOffset={4}
        >
          {/* Preset buttons remain the same */}
          <div className='grid grid-cols-2 gap-2'>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant='outline'
                size='sm'
                onClick={() => {
                  const range = preset.getRange()
                  applyRange(range)
                  setShowCustom(false)
                }}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant={showCustom ? 'default' : 'outline'}
              size='sm'
              onClick={() => setShowCustom((prev) => !prev)}
            >
              Custom
            </Button>
          </div>

          {/* Single calendar for date range selection */}
          {showCustom && (
            <div className='mt-4'>
              {/* 
                *** REMOVE CUSTOM HEADER AND MONTH/YEAR PICKER PANEL ***
                The logic below is now handled by the Calendar component with captionLayout='dropdown'
              */}
              {/* <div className='mb-2 flex items-center justify-center gap-2'>...</div> */}
              {/* {showMonthPicker && (<div className='bg-background mb-3 rounded border p-2'>...</div>)} */}

              <Calendar
                mode='range'
                numberOfMonths={1}
                selected={internalDate}
                onSelect={applyRange}
                onMonthChange={(m) => setDisplayMonth(m)}
                month={displayMonth}
                className='p-0'
                // *** KEY CHANGES START HERE ***
                // 1. Enable dropdowns for month/year
                captionLayout='dropdown'
                // 2. Define the range of years for the year dropdown
                fromYear={1900}
                toYear={2050}
                // *** KEY CHANGES END HERE ***

                classNames={{
                  month: 'space-y-4',

                  // *** REMOVE 'hidden' overrides for nav and caption ***
                  // nav: 'hidden', // REMOVED
                  // caption: 'hidden', // REMOVED
                  // caption_label: 'hidden', // REMOVED
                  // caption_dropdowns: 'hidden', // REMOVED

                  // 3. Update caption and nav classes for the new dropdown layout
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'hidden', // Hides the default label, letting dropdowns shows

                  // The nav buttons (arrows) will now position relative to the caption
                  nav_button: cn(
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                  ),
                  // Adjust button positioning to be relative to the caption/header
                  nav_button_previous: 'absolute left-1 top-1 display-none',
                  nav_button_next: 'absolute right-1 top-1 display-none',

                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell:
                    'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                    'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                  ),
                  day: cn('h-8 w-8 p-0 font-normal aria-selected:opacity-100'),

                  // Add/Adjust styles for the dropdown select elements (common in shadcn setup)
                  vhidden: 'hidden', // Hides an element sometimes used for accessibility
                  dropdown: 'text-sm p-1 rounded-md border-0',
                  //@ts-ignore
                  select:
                    'p-0 px-2 appearance-none text-sm font-medium focus:ring-0 focus:outline-none bg-transparent',
                  // Other custom classes for styling the dropdowns might be needed depending on your base components
                }}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
