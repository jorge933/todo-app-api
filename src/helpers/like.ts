export function like(value: string) {
  return {
    $regex: value.replace(/like:/i, ''),
    $options: 'i',
  };
}
