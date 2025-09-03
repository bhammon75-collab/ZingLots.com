// ARCHIVED: Legacy navigation component (do not use)
// This file is kept to avoid breaking imports on older branches. New code must use src/components/layout/Header.tsx
export default function ModernNavArchived() {
	if (import.meta.env.DEV) {
		console.warn("ModernNav is archived. Use components/layout/Header instead.");
	}
	return null;
}