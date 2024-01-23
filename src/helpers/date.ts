export function date(value: string, option: 'start' | 'end') {
  const includesDate = value.toLowerCase().includes('date:');

  if (includesDate) {
    const valueWithoutOperator = value.replace(/date:/i, '');
    const hour = option === 'start' ? '00:00' : '23:59:59';
    const formattedDate = formatDate(valueWithoutOperator, hour);

    return formattedDate;
  }

  return value;
}

function formatDate(date: string, hour: string) {
  if (date.includes('T')) date = date.replace('/', '-');
  else date = date.replace('-', '/');

  const formattedDate = new Date(`${date}  ${hour}`);

  console.log(formattedDate);

  return formattedDate;
}
