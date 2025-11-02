// netlify/functions/ably-token.js
const Ably = require('ably');

exports.handler = async function () {
  try {
    const apiKey = process.env.ABLY_API_KEY; // MUST be set in Netlify env
    if (!apiKey) {
      return { statusCode: 500, body: 'Missing ABLY_API_KEY env var' };
    }

    // Use Ably SDK to build a valid TokenRequest
    const rest = new Ably.Rest(apiKey);

    // Optional: lock a clientId if you want (and match it on the client)
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId: 'phonebot-client',
      // capability can be restricted, but allow the 'phonebot:*' channel we use:
      capability: JSON.stringify({
        'phonebot:*': ['publish', 'subscribe', 'presence', 'history']
      }),
      ttl: 60 * 60 * 1000 // 1 hour
    });

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(tokenRequest)
    };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
