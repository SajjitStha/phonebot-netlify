// netlify/functions/ably-token.js
const Ably = require('ably/promises');

exports.handler = async function () {
  try {
    if (!process.env.ABLY_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing ABLY_API_KEY env var' }) };
    }
    const client = new Ably.Rest(process.env.ABLY_API_KEY);
    const tokenRequest = await client.auth.createTokenRequest({ clientId: 'web' });
    return { statusCode: 200, body: JSON.stringify(tokenRequest) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message, stack: e.stack }) };
  }
};
