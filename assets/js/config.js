/**
 * PiggyBank site configuration.
 * Keep public launch details here so they are not repeated through the UI.
 * Never place private API keys or secrets in this browser-delivered file.
 */
export const siteConfig = Object.freeze({
  tokenName: "PiggyBank",
  ticker: "$PIGGYBANK",
  chain: "BNB Chain",
  contractAddress: "",
  tokenomics: {
    taxPercent: 1,
    holderRewardSharePercent: 100,
    devTaxPercent: 0,
    marketingTaxPercent: 0,
  },
  links: {
    buy: "",
    chart: "",
    bscscan: "",
    telegram: "",
    x: "",
  },
  blockchain: {
    stage2Enabled: false,
    rpcUrl: "",
    rewardContractAddress: "",
    usdtContractAddress: "",
    refreshIntervalMs: 45000,
    rewardMilestones: [0, 1000, 5000, 10000, 25000],
  },
});
