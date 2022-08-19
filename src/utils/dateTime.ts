export function ISOToLocal(datetime: string) {
  // Convert a string from ISO format to datetime with only hours and minutes
  // Eg. 2002-08-22T15:18:00.000Z => 2002-08-22T18:18
  const d = new Date(datetime)
  const YYYY = d.toLocaleString('default', { year: 'numeric' })
  const MM = d.toLocaleString('default', { month: '2-digit' })
  const DD = d.toLocaleString('default', { day: '2-digit' })
  const H = d.toLocaleString('default', { hour: 'numeric' })
  const M = d.toLocaleString('default', { hour: 'numeric' })
  return `${YYYY}-${MM}-${DD}T${H}:${M}`
}
