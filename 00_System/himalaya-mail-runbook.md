# Himalaya mail runbook (Claude Code / WSL)

**Why this exists:** the connected **Gmail MCP is `bguy.rubin` only and cannot download attachments**. For anything touching `josephdoronrubin@gmail.com` or `bhollandvest@gmail.com`, or any **attachment** (read/download/send), drive the `himalaya` CLI directly from this runtime via WSL. No Hermes model, no OAuth — himalaya is already authenticated for all three accounts (IMAP+SMTP). Proven 2026-06-24 (ATCON/Boortmalt offer).

**Invoke from Claude Code:** prefix every command with `wsl.exe -e bash -lc '…'`.

## Accounts (already configured)
`bguy` (default) · `hollandvest` · `joseph` — all IMAP+SMTP. List: `himalaya account list`.

## Read
```bash
himalaya folder list -a joseph
himalaya envelope list -a joseph -s 15                         # inbox, 15 newest
himalaya envelope list -a joseph -f "[Gmail]/Sent Mail" -s 6
himalaya message read <ID> -a joseph -H Message-ID -H From -H To -H Cc   # headers + body
```

## Attachments (the MCP can't do this)
```bash
himalaya attachment download <ID> -a joseph -f "[Gmail]/Sent Mail"
# Saves into /tmp/<original filename>. ⚠ WSL wipes /tmp when it idles between
# separate wsl.exe calls — do download + parse in ONE call.
```
Read a `.docx`: `python3 -c 'import zipfile,re,glob,sys; ...'` over `word/document.xml`.
Read a `.pdf`: `pdftotext "<file>" -`.

## Compose (build a raw RFC822 .eml, then save or send)
Headers to set: `From / To / Cc / Subject / In-Reply-To / References` (copy the original's `Message-ID` for threading) + `MIME-Version: 1.0` + `Content-Type: text/plain; charset=utf-8`.
```bash
himalaya message save -a joseph -f "[Gmail]/Drafts" < /tmp/reply.eml   # draft (default)
himalaya message send -a joseph < /tmp/reply.eml                       # send + copy to Sent
```
**Safety:** default to **save → Drafts**. Per `/00_System/identity-policy.md`, never `send` external mail without explicit per-action confirmation. Use the correct sender account for the context.

## Hermes model note
Deterministic mail ops (send a pre-written message, download a file) need **no LLM** — use himalaya directly; don't block on Hermes' provider/model. Switching Hermes to the Anthropic subscription (`hermes model` → OAuth) is a **Guy-only credential step** (browser login + `sk-ant-oat-` token); an agent must not perform it.
