# PiggyBank launch website

A lightweight, mobile-first Stage 1 website for PiggyBank on BNB Chain. It uses plain HTML, CSS and JavaScript, so there is no framework, database or production build dependency.

## Project structure

```text
index.html
assets/
  css/styles.css
  images/piggybank-logo.jpg
  images/design-reference.jpg
  js/config.js
  js/blockchain-service.js
  js/app.js
```

## 1. Run locally

ES modules need a small local web server. From this folder, run one of these:

```powershell
python -m http.server 8080
```

If the normal Python command is unavailable, use any static server you already have. Then open `http://localhost:8080`.

## 2. Edit token details and links

Edit `assets/js/config.js`. This is the single source for:

- token name, ticker and chain
- contract address
- tax figures
- Buy, DexScreener, BscScan, Telegram and X links
- Stage 2 blockchain settings

Empty links stay visibly disabled. The contract copy button appears only after a contract address is entered.

Do not put private RPC or API keys in this file. Everything in it is delivered to the visitor's browser.

## 3. Production files

There is no build command for Stage 1. The project folder is already the production output. Before launch:

1. Enter the confirmed contract and URLs in `assets/js/config.js`.
2. Check the page locally on phone and desktop sizes.
3. Confirm all trading and community links.
4. Add the final live site URL to the Open Graph metadata in `index.html` if required by your sharing setup.

## 4. Upload to SiteGround

Using SiteGround File Manager or SFTP, upload the contents of this folder into the domain's `public_html` directory:

- `index.html` must sit directly inside `public_html`.
- Upload the complete `assets` folder beside it.
- Do not upload the outer `piggybank-website` folder unless the site is meant to live in a subfolder.

No WordPress, Node server, Vercel or Netlify setup is required.

## 5. Add Stage 2 blockchain data

The reward UI already calls the stable service methods in `assets/js/blockchain-service.js`:

- `getTotalRewards()`
- `getRewards24h()`
- `getHolderCount()`
- `getRecentRewards()`

At launch, they return an unavailable state and the page shows no fabricated figures.

For Stage 2:

1. Confirm the deployed reward contract and exact ABI/function names.
2. Create an adapter that reads the verified public contract, or calls a server-side API if indexing or private API keys are needed.
3. Expose that adapter as `window.PiggyBankBlockchainAdapter` before `app.js` loads.
4. Enter the public configuration in `assets/js/config.js` and set `stage2Enabled` to `true`.

Each adapter method should return either:

```js
{ status: "available", value: 12458.63 }
```

or:

```js
{ status: "unavailable", value: null, reason: "not-live" }
```

When ready, the page refreshes live reward data every 45 seconds by default. Change `refreshIntervalMs` in the config if needed. The milestone values for later mascot artwork are also kept in the config; Stage 1 does not pretend those images exist.

## Launch checklist

- Verify the contract address from an official source.
- Verify the Buy, chart, explorer and social links.
- Confirm the final tokenomics.
- Test at 360px, 390px, 430px and desktop widths.
- Test keyboard navigation and reduced-motion mode.
- Replace relative social preview metadata with the final absolute production URL if required.
- Keep the risk wording visible.
