// netlify/functions/ably-token.js
const Ably = require('ably');

exports.handler = async function () {
  try {
    const apiKey = process.env.ABLY_API_KEY; // set in Netlify → Site config → Environment variables
    if (!apiKey) {
      return { statusCode: 500, body: 'Missing ABLY_API_KEY env var' };
    }

    const rest = new Ably.Rest(apiKey);

    // NOTE: clientId must match the one used in index.html (phonebot-client)
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
    return { statusCode: 500, body: String(err) };
  }
};
