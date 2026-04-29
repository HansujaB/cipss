// ─────────────────────────────────────────────────────────
// Google Maps helper
// Optional geocoding and static-map URL generation
// ─────────────────────────────────────────────────────────

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function hasGoogleMaps() {
  return !!GOOGLE_MAPS_API_KEY;
}

async function geocodeArea(area) {
  if (!GOOGLE_MAPS_API_KEY || !area) {
    return null;
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', area);
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok || data.status !== 'OK' || !data.results?.length) {
      return null;
    }

    const [result] = data.results;
    const location = result.geometry?.location;
    if (!location) {
      return null;
    }

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address || area,
      placeId: result.place_id || null,
    };
  } catch (error) {
    console.warn('[GoogleMaps] Geocoding failed:', error.message);
    return null;
  }
}

function getCampaignMapUrls({ title, area, lat, lng }) {
  const label = encodeURIComponent(area || title || 'campaign location');

  if (lat && lng) {
    const query = `${lat},${lng}`;
    return {
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      staticMapUrl: GOOGLE_MAPS_API_KEY
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(query)}&zoom=13&size=600x320&markers=color:green|${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
        : null,
    };
  }

  return {
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${label}`,
    staticMapUrl: null,
  };
}

module.exports = {
  hasGoogleMaps,
  geocodeArea,
  getCampaignMapUrls,
};
