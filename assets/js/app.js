import { siteConfig } from "./config.js";
import { createBlockchainService } from "./blockchain-service.js";

document.documentElement.classList.add("motion-ready");

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function bindConfiguration() {
  const values = {
    tokenName: siteConfig.tokenName,
    ticker: siteConfig.ticker,
    chain: siteConfig.chain,
  };

  Object.entries(values).forEach(([key, value]) => {
    $$(`[data-config="${key}"]`).forEach((element) => {
      element.textContent = value;
    });
  });

  const tax = siteConfig.tokenomics;
  const taxParts = [
    `${tax.taxPercent}% tax`,
    `${tax.holderRewardSharePercent}% to holder rewards`,
    tax.devTaxPercent === 0 ? "No dev tax" : `${tax.devTaxPercent}% dev tax`,
    tax.marketingTaxPercent === 0 ? "No marketing tax" : `${tax.marketingTaxPercent}% marketing tax`,
  ];
  $("[data-tokenomics]").textContent = taxParts.join(" · ");

  $$('[data-link]').forEach((link) => {
    const url = siteConfig.links[link.dataset.link];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.title = "Coming soon";
    }
  });

  const contract = $("[data-contract]");
  const copyButton = $("[data-copy-contract]");
  if (siteConfig.contractAddress) {
    contract.textContent = siteConfig.contractAddress;
    copyButton.hidden = false;
  }

  $("[data-year]").textContent = new Date().getFullYear();
}

function setupNavigation() {
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-nav]");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.dataset.open = String(open);
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  $$("a", nav).forEach((link) => link.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function setupContractCopy() {
  const button = $("[data-copy-contract]");
  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contractAddress);
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = "Copy"; }, 1800);
    } catch {
      button.textContent = "Copy failed";
    }
  });
}

function setupReveals() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function setUnavailableRewards() {
  const panel = $("[data-rewards-panel]");
  panel.dataset.status = "unavailable";
  panel.dataset.pigLevel = "1";
  $("[data-reward-total]").textContent = "—";
  $("[data-reward-label]").textContent = "Live USDT rewards coming after launch";
  $("[data-reward-metrics]").hidden = true;
  const heroRewards = $("[data-hero-rewards]");
  if (heroRewards) {
    heroRewards.hidden = true;
    $("[data-hero-reward-total]").textContent = "";
  }
}

async function updateRewards(service) {
  try {
    const [total, today, holders, recent] = await Promise.all([
      service.getTotalRewards(),
      service.getRewards24h(),
      service.getHolderCount(),
      service.getRecentRewards(),
    ]);

    if (total.status !== "available" || !Number.isFinite(Number(total.value))) {
      setUnavailableRewards();
      return;
    }

    const numericTotal = Number(total.value);
    const reachedMilestones = siteConfig.blockchain.rewardMilestones.filter((threshold) => numericTotal >= threshold).length;
    const panel = $("[data-rewards-panel]");
    panel.dataset.status = "live";
    panel.dataset.pigLevel = String(Math.max(1, reachedMilestones));
    const formattedTotal = `${currency.format(numericTotal)} USDT`;
    $("[data-reward-total]").textContent = formattedTotal;
    $("[data-reward-label]").textContent = "rewarded to holders";
    const heroRewards = $("[data-hero-rewards]");
    if (heroRewards) {
      $("[data-hero-reward-total]").textContent = formattedTotal;
      heroRewards.hidden = false;
    }
    $("[data-reward-metrics]").hidden = false;
    $("[data-reward-today]").textContent = today.status === "available" ? currency.format(Number(today.value)) : "Unavailable";
    $("[data-holder-count]").textContent = holders.status === "available" ? Number(holders.value).toLocaleString("en-US") : "Unavailable";
    $("[data-reward-transactions]").textContent = recent.status === "available"
      ? (Array.isArray(recent.value) ? recent.value.length : Number(recent.value?.count ?? recent.value).toLocaleString("en-US"))
      : "Unavailable";
  } catch (error) {
    console.warn("PiggyBank rewards are temporarily unavailable.", error);
    setUnavailableRewards();
  }
}

function setupRewards() {
  const service = createBlockchainService(siteConfig.blockchain);
  updateRewards(service);

  if (service.isReady()) {
    window.setInterval(() => updateRewards(service), siteConfig.blockchain.refreshIntervalMs);
  }
}

bindConfiguration();
setupNavigation();
setupContractCopy();
setupReveals();
setupRewards();
