"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { ScrollArea } from "./scroll-area"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        caption_dropdowns: "flex gap-1.5",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        Dropdown: (props: DropdownProps) => {
          const { fromDate, fromMonth, fromYear, toDate, toMonth, toYear } =
            props;
          const { goToMonth, month } = props;
          if (props.name === "months") {
            const months = Array.from({ length: 12 }, (_, i) => {
              return new Date(1970, i, 1);
            });
            return (
              <Select
                value={month?.getMonth().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(month || new Date());
                  newDate.setMonth(parseInt(value));
                  goToMonth(newDate);
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem value={i.toString()} key={i}>
                      {format(m, "MMMM")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          } else if (props.name === "years") {
            const years = Array.from(
              { length: (toYear || 0) - (fromYear || 0) + 1 },
              (_, i) => (fromYear || 0) + i
            ).reverse();
            return (
              <Select
                value={month?.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(month || new Date());
                  newDate.setFullYear(parseInt(value));
                  goToMonth(newDate);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {years.map((y) => (
                      <SelectItem value={y.toString()} key={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            );
          }
          return null;
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

function format(date: Date, fmt: string) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  if (fmt === "MMMM") {
    return monthName[month];
  }
  return date.toLocaleDateString();
}

export { Calendar }
