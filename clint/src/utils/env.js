// Centralized env access for Vite (use VITE_* keys)

export const getEnv = () => ({
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
	paymentUrl: import.meta.env.VITE_PAYMENT_URL || '',
	filesBaseUrl: import.meta.env.VITE_FILES_BASE_URL || '',
	reportsBaseUrl: import.meta.env.VITE_REPORTS_BASE_URL || '',
	authLogoutUrl: import.meta.env.VITE_AUTH_LOGOUT_URL || '',
});

export const openExternal = (url) => {
	if (!url) return;
	window.open(url, '_blank', 'noopener,noreferrer');
};

export const apiFetch = async (path, options = {}) => {
	const { apiBaseUrl } = getEnv();
	const url = path.startsWith('http') ? path : `${apiBaseUrl}${path}`;
	const res = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Request failed (${res.status}): ${text}`);
	}
	const ct = res.headers.get('content-type') || '';
	return ct.includes('application/json') ? res.json() : res.text();
};


