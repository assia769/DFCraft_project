
export const config = {
    api: {
        url: import.meta.env.VITE_API_URL,
    },
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_CLIENT_SECRET,
        authorizeUrl: import.meta.env.VITE_AUTHORIZE_URL,
        accessTokenUrl: import.meta.env.VITE_ACCESS_TOKEN_URL,
    }
}