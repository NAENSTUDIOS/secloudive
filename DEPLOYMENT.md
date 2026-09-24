# SeCloudive Deployment

## GitHub Setup

1. Create a public GitHub repository named `SeCloudive`.
2. From the project root, initialize Git if needed:

```bash
git init
git add .
git commit -m "Prepare SeCloudive for AWS Amplify"
git branch -M main
git remote add origin https://github.com/<owner>/SeCloudive.git
git push -u origin main
```

3. Confirm that `node_modules`, `dist`, local files, and secrets are excluded by `.gitignore`.
4. Confirm `README.md`, `DEPLOYMENT.md`, `docs/HACKATHON_PROOF.md`, and `amplify.yml` are visible in the repository.

## AWS Amplify Setup

1. Open AWS Amplify in the target AWS account.
2. Select **New app** and **Host web app**.
3. Connect the GitHub provider and authorize the SeCloudive repository.
4. Select the `main` branch.
5. Confirm Amplify uses the repository's `amplify.yml`.
6. Review the build settings and start deployment.
7. Verify the generated public URL.
8. Update the placeholder Live Demo footer URL after the final Amplify URL is known.

## Build Commands

Local development:

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
npm run preview
```

Amplify uses:

```bash
npm ci
npm run build
```

Build artifacts are published from `dist`.

## Production Verification

Before submitting:

- Open `/`, `/investigations`, `/investigations/inv-iam-01`, `/dashboard`, `/categories`, `/challenge/iam-01`, `/architecture-reviews`, `/internship-simulator`, `/report`, and `/about`.
- Test the flagship **Security Investigation Simulator** (`/investigations`):
  - Filter across the 5 domains (IAM, S3, Networking, Monitoring, Architecture).
  - Open ticket `#INC-IAM-01` and verify the Evidence Locker tabs switch properly.
  - Select verified findings, assign severity rating, and click **Submit Incident Dossier**.
  - Verify that the Official Incident Resolution Dossier renders (RCA, Technical Security Impact, Business Impact, Step-by-Step Remediation Plan, AWS Best Practices, Lessons Learned).
  - Click **Export Post-Mortem (.MD)** to confirm markdown download.
- Test multi-finding Architecture Reviews (`/architecture-reviews`).
- Test weekly SOC On-Call tickets (`/internship-simulator`).
- Test report reset and personalized AWS learning-path recommendations (`/report`).
- Check the public URL at mobile, tablet, and desktop widths.
- Confirm zero browser console errors and fast code-split chunk loading.
- Confirm the Amplify build completes successfully via `npm ci` and `npm run build`.

## Troubleshooting

### Amplify build fails during install

- Confirm the repository contains `package-lock.json`.
- Use Node.js and npm versions supported by the current Amplify image.
- Run `npm ci` locally to detect lockfile drift.

### Blank page after deployment

- Confirm `index.html` points to `/src/main.jsx`.
- Confirm Amplify publishes `dist`.
- Confirm the deployed URL is using the latest successful build.

### Refreshing a nested route fails

Configure the Amplify rewrite rule for SPA fallback:

```text
Source: </<*>
Target: /index.html
Type: 200 (Rewrite)
```

### External AWS links do not open

Verify that the browser allows new tabs and that the resource link uses `target="_blank"` with `rel="noopener noreferrer"`.

## AWS Amplify Status

**AWS Amplify Ready ✅** for build and hosting compatibility.

A public Amplify URL, successful Amplify build screenshot, and dashboard screenshot must still be captured externally for final hackathon proof.
