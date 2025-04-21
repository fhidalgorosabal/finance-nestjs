export function parseToDate(input: string): Date | null {  
  const dateParts = input.split(/[/-]/);
  let year: string, month: string, day: string;

  if (dateParts[0].length === 4) {
    [year, month, day] = dateParts;
  } else {
    [day, month, year] = dateParts;
  }

  const isoString = `${year}-${month}-${day}T00:00:00.000Z`;
  const parsed = new Date(isoString);

  if (isNaN(parsed.getTime())) return null;  

  return parsed;
}

