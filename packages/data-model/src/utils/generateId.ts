export default function generateId(): string {
	return `${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`;
}
