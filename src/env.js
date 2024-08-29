const envClient = {
    VITE_BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
    GOOGLE_OATH_CLIENT_ID: import.meta.env.VITE_GOOGLE_OATH_CLIENT_ID,
    GOOGLE_OATH_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_OATH_CLIENT_SECRET,
};

export default envClient;
