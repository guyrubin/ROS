# Arbor Billing — Go-Live Runbook (one step is yours, the rest is automated)

**State as of 2026-06-21:** Billing engine is 100% built + configured. Catalog (4 products + 7-day trial), `plus`/`family` entitlements, offering `default` (`ofrng2b9a615534`) with the 4 correctly-named packages, the RC webhook (proven end-to-end → Firestore), and the Web Purchase Link ("Arbor web checkout") all exist. The Web Billing payment gateway has the Stripe account `Arbor (acct_1Tjdy1RX2LW7IS0J)` + EUR selected.

**The ONLY blocker = Stripe live activation (KYC).** RevenueCat's Web Billing "Save" stays disabled and only a *sandbox* `pay.rev.cat/sandbox/...` link is issued until the Stripe account can accept live charges. No agent can complete KYC or enter bank details — that step is legally yours.

---

## STEP 0 — Guy (the only human step) · ~10–15 min

1. **dashboard.stripe.com** → complete account activation: business profile, bank account, tax details. Work the checklist until Stripe says **"you can accept live payments."**
2. Back in **RevenueCat → Apps → arbor (Web Billing) → Billing tab**: the Stripe account + **EUR** should now **Save** (the button enables once Stripe is live). Save it.
3. **RevenueCat → Funnels → Purchase Links → "Arbor web checkout" → Share URL**: the dialog now shows a **production** `https://pay.rev.cat/<token>` link (no `/sandbox/`). **Copy it.**
4. Paste that production link back to me — or run STEP 1 yourself.

---

## STEP 1 — Wire the production link (agent-doable once the link exists)

```bash
PROD_LINK="https://pay.rev.cat/<PASTE_PRODUCTION_TOKEN>"   # from STEP 0.3, NOT the /sandbox/ one
PROJ=arborprd-westeu
RUNTIME_SA=arbor-deploy@arborprd-westeu.iam.gserviceaccount.com

# 1. Create the secret + first version
printf '%s' "$PROD_LINK" | gcloud secrets create arbor-billing-web-purchase-link \
  --project=$PROJ --replication-policy=automatic --data-file=- \
  || printf '%s' "$PROD_LINK" | gcloud secrets versions add arbor-billing-web-purchase-link --project=$PROJ --data-file=-

# 2. Let the Cloud Run runtime SA read it
gcloud secrets add-iam-policy-binding arbor-billing-web-purchase-link --project=$PROJ \
  --member="serviceAccount:$RUNTIME_SA" --role=roles/secretmanager.secretAccessor

# 3. Attach to the running API (survives CI because it's a secret, not --set-env-vars)
gcloud run services update arbor-api --project=$PROJ --region=europe-west4 \
  --update-secrets=BILLING_WEB_PURCHASE_LINK=arbor-billing-web-purchase-link:latest
```

Then add it to the durable build so it persists across CI deploys — in `cloudbuild.prod.yaml`, extend the `--set-secrets` line (already carries `GEMINI_API_KEY` + `REVENUECAT_WEBHOOK_AUTH` via PR `claude/billing-durability`):

```
GEMINI_API_KEY=arbor-gemini-key:latest,REVENUECAT_WEBHOOK_AUTH=arbor-rc-webhook-auth:latest,BILLING_WEB_PURCHASE_LINK=arbor-billing-web-purchase-link:latest
```

> ⚠️ Do NOT wire the **sandbox** link to prod — a user could complete a sandbox "purchase" and the webhook would grant real Plus for free. Wire only the production token, and only after Stripe is live.

---

## STEP 2 — Verify end-to-end (agent + Guy)

- `ENFORCE_ENTITLEMENTS=true` is already set in `cloudbuild.prod.yaml`, so non-comped users hit the paywall and founder/test emails stay comped via `ARBOR_FAMILY_EMAILS`. Confirm a non-comped account sees the paywall; confirm `bguy.rubin@gmail.com` stays Plus.
- **B6 — euro #1:** buy Plus on web in prod with a real card → checkout → RC webhook → `entitlements/{uid}` flips to `plan=plus` → unlimited coach unlocks. (I drive everything except the card entry, which is yours.)
- Optionally set `BILLING_MANAGE_URL` (RC Customer Center / Stripe billing portal URL) the same way as STEP 1 so the Account screen's "manage/cancel" link works.

---

## Reference

- RC project `9fdf4a30` · Web Billing app `app6d4a73bbba` · Stripe `acct_1Tjdy1RX2LW7IS0J` (EUR)
- Offering `default` = `ofrng2b9a615534`; packages `plus_monthly`/`plus_annual`/`family_monthly`/`family_annual`
- Webhook URL `https://arbor-api-628681500167.europe-west4.run.app/webhooks/billing/revenuecat`; secret `arbor-rc-webhook-auth`
- Pricing: Plus €12.99/mo · €119/yr · Family €19.99/mo · €179/yr · 7-day trial · €89/yr beta lock
- Full status: `PRODUCT-BACKLOG.md` (Gate B) + memory `arbor-product-backlog-canonical`
