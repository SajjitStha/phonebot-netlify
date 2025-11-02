// netlify/functions/ably-token.js
const Ably = require('ably/promises'); // <-- PROMISES BUILD (important)

exports.handler = async function () {
  try {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: 'Missing ABLY_API_KEY env var' };
    }

    const rest = new Ably.Rest(apiKey);

    // If you want to enforce a clientId, keep this in sync with index.html
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId: 'phonebot-client',
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
    return { statusCode: 500, body: String(err && err.stack || err) };
  }
};
