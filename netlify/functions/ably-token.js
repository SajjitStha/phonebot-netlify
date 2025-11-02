// Netlify function (ESM) that issues an Ably token request
import Ably from 'ably/promises';

export async function handler() {
  try {
    const client = new Ably.Rest(process.env.ABLY_API_KEY);
    const tokenRequest = await client.auth.createTokenRequest({ clientId: 'web' });
    return { statusCode: 200, body: JSON.stringify(tokenRequest) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
