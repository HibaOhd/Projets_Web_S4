
function generateCodeVerifier(length = 128) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let verifier = ''
  for (let i = 0; i < length; i++) {
    verifier += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return verifier
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const config = useRuntimeConfig()

export function useSpotifyAuth() {
  const clientId = config.public.spotifyClientId;
  const redirectUri = config.public.spotifyRedirectUri;
  const scopes = [
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-library-read',
  'user-library-modify',
  'user-top-read',
  'user-read-recently-played',
  'streaming',
  'app-remote-control',
  'user-follow-read',
  'user-follow-modify'
];

  const login = async () => {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)

    localStorage.setItem('spotify_code_verifier', verifier)

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      scope: scopes.join(' ')
    })

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  const getToken = () => {
    const token = localStorage.getItem('spotify_access_token')
    const expiry = localStorage.getItem('spotify_token_expires')
    if (!token || Date.now() > expiry) return null
    return token
  }

  const logout = () => {
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_token_expires')
    localStorage.removeItem('spotify_code_verifier')
  }

  return { login, getToken, logout }
}
