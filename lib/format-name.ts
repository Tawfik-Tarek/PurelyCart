export default function formatName(name: string) {
  if (name.length > 20) {
    return name.slice(0, 20) + "...";
  }
  return name;
}