export function date(value: string) {
  const includesDate = value.toLowerCase().includes('date=');

  if (includesDate) {
    const valueWithoutOperator = value.replace('date=', '');
    const formattedDate = formatDate(valueWithoutOperator);

    return formattedDate;
  }

  return value;
}

function formatDate(date: string) {
  date = date.replace('-', '/');

  const formattedDate = new Date(date);

  return formattedDate;
}
