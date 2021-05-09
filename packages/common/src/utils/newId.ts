export default function newId(): string {
  return `${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`;
}
