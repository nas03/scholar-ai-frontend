import { ScheduleTime } from "../SchedulePicker";

export const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-cyan-500", label: "Cyan" },
  { value: "bg-yellow-500", label: "Yellow" }
];

export function generateScheduleString(scheduleDetails: ScheduleTime[]): string {
  if (!scheduleDetails || scheduleDetails.length === 0) return "";
  
  const grouped = scheduleDetails.reduce((acc, schedule) => {
    const key = `${schedule.startTime}-${schedule.endTime}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(schedule.day.slice(0, 3));
    return acc;
  }, {} as Record<string, string[]>);
  
  return Object.entries(grouped)
    .map(([time, days]) => {
      const [start, end] = time.split('-');
      return `${days.join(', ')} ${formatTime(start)}`;
    })
    .join(' • ');
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}
