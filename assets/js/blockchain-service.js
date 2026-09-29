/**
 * The page talks only to this service. Stage 2 can add an adapter backed by a
 * public BNB Chain RPC or a server-side API without changing any UI component.
 */

const unavailable = (reason = "not-live") => ({
  status: "unavailable",
  value: null,
  reason,
});

export class BlockchainService {
  constructor(config, adapter = null) {
    this.config = config;
    this.adapter = adapter;
  }

  isReady() {
    return Boolean(
      this.config.stage2Enabled &&
      this.config.rewardContractAddress &&
      this.adapter
    );
  }

  async getTotalRewards() {
    if (!this.isReady()) return unavailable();
    return this.adapter.getTotalRewards();
  }

  async getRewards24h() {
    if (!this.isReady()) return unavailable();
    return this.adapter.getRewards24h();
  }

  async getHolderCount() {
    if (!this.isReady()) return unavailable();
    return this.adapter.getHolderCount();
  }

  async getRecentRewards() {
    if (!this.isReady()) return unavailable();
    return this.adapter.getRecentRewards();
  }
}

export function createBlockchainService(config) {
  // Stage 2 may expose a verified adapter before this module initialises.
  // Keeping it injected avoids scattering RPC or contract logic through app.js.
  const adapter = window.PiggyBankBlockchainAdapter || null;
  return new BlockchainService(config, adapter);
}
