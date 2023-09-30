const axios = require('axios');
const { sleep } = require('./general');

module.exports = class DiscordAPI {

  token;

  constructor(token) {
    this.token = token;
  }

  get headers() {
    return {
      Authorization: this.token,
    };
  }

  async handleRateLimits(res) {
    const requestsRemaining = res.headers['X-RateLimit-Remaining'];
    const resetAfter = res.headers['X-RateLimit-Reset-After'];
    if (requestsRemaining && parseInt(requestsRemaining) <= 0) {
      await sleep(parseInt(resetAfter) * 1000);
    }
  }

  async userInfo() {
    const res = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: this.headers
    });
    await this.handleRateLimits(res);
    return res.data;
  }

  async paymentSources() {
    const res = await axios.get('https://discord.com/api/v10/users/@me/billing/payment-sources', {
      headers: this.headers
    });
    await this.handleRateLimits(res);
    return res.data;
  }

  async gifts() {
    const res = await axios.get('https://discord.com/api/v10/users/@me/outbound-promotions/codes', {
      headers: this.headers
    });
    await this.handleRateLimits(res);
    return res.data;
  }

};
