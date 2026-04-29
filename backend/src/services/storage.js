// ─────────────────────────────────────────────────────────
// Google Cloud Storage helper
// Generates resumable upload URLs when configured.
// ─────────────────────────────────────────────────────────

const { GoogleAuth } = require('google-auth-library');

const GCS_BUCKET = process.env.GCS_BUCKET;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;

function hasStorage() {
  return !!(GCS_BUCKET && GOOGLE_CLOUD_PROJECT);
}

async function createResumableUpload({ objectName, contentType = 'image/jpeg', metadata = {} }) {
  if (!hasStorage()) {
    return null;
  }

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/devstorage.read_write'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken =
    typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;

  const endpoint = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(
    GCS_BUCKET
  )}/o?uploadType=resumable&name=${encodeURIComponent(objectName)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Upload-Content-Type': contentType,
    },
    body: JSON.stringify({
      name: objectName,
      metadata,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create upload session: ${text}`);
  }

  const uploadUrl = response.headers.get('location');
  if (!uploadUrl) {
    throw new Error('Upload session URL missing');
  }

  return {
    uploadUrl,
    publicUrl: `https://storage.googleapis.com/${GCS_BUCKET}/${objectName}`,
    bucket: GCS_BUCKET,
    objectName,
  };
}

module.exports = {
  hasStorage,
  createResumableUpload,
};
