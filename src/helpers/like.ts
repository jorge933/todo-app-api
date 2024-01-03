export function like(value: string) {
  const includesLike = value.toLowerCase().includes('like=');

  return includesLike
    ? {
        $regex: value.replace('like=', ''),
        $options: 'i',
      }
    : value;
}
