import { Dropbox } from 'dropbox';

let accessToken = null;
let tokenExpiresAt = 0;

async function getValidAccessToken(refreshToken) {
  const now = Date.now();

  // Reuse token if still valid
  if (accessToken && now < tokenExpiresAt) {
    return accessToken;
  }

  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.DROPBOX_APP_KEY,
      client_secret: process.env.DROPBOX_APP_SECRET,
    }),
  });

  const data = await response.json();

  // 🔍 Debug log (remove later)
  console.log('Dropbox token response:', data);

  if (!response.ok) {
    throw new Error(
      `Token refresh failed: ${data.error_description || data.error}`
    );
  }

  if (!data.access_token) {
    throw new Error('No access token returned from Dropbox');
  }

  accessToken = data.access_token;

  // Refresh 1 minute early
  tokenExpiresAt = now + (data.expires_in * 1000) - 60000;

  return accessToken;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path } = req.body;

    const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

    // 🔍 Debug env check (remove later)
    console.log('ENV CHECK:', {
      keyExists: !!process.env.DROPBOX_APP_KEY,
      secretExists: !!process.env.DROPBOX_APP_SECRET,
      refreshExists: !!refreshToken,
    });

    if (!refreshToken) {
      return res.status(500).json({
        error: 'Dropbox refresh token not configured',
      });
    }

    if (!path) {
      return res.status(400).json({ error: 'File path required' });
    }

    const token = await getValidAccessToken(refreshToken);

    const dbx = new Dropbox({ accessToken: token });

    const linkResponse = await dbx.filesGetTemporaryLink({ path });

    return res.status(200).json({
      url: linkResponse.result.link,
    });
  } catch (error) {
    console.error('Error getting download link:', error);

    return res.status(500).json({
      error: error.message || 'Failed to get download link',
    });
  }
}