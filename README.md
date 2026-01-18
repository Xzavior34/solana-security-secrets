
# 🛡️ Solana Security Academy: The Zero-to-Hero Reference

> **Live Interactive Experience:** https://solana-security-secrets.vercel.app/
> *A gamified, terminal-based deep dive into the 5 most common Solana vulnerabilities.*

## 📖 The Philosophy

Security on Solana is not about complex cryptography; it’s about **Account Validation**. In a world where every account is an untrusted input, the developer’s job is to prove three things:

1. **Who** is calling the program? (Signer Authorization)
2. **What** data is being passed? (Type & Owner Validation)
3. **Where** is the state stored? (PDA Verification)

This repository serves as a side-by-side educational reference, contrasting "broken" code with "secure" Anchor implementations.

---

## 🛠️ The 5 Security Modules

### 1. Signer Authorization (The Fake ID Attack)
**The Vulnerability:** An instruction allows a withdrawal because it fails to check if the `authority` account actually signed the transaction.
* **Vulnerable:** Accepts `AccountInfo` and trustingly moves funds.
* **Secure:** Enforces the `Signer<'info>` type, triggering Anchor's internal signature check.

### 2. Privilege Escalation (The Admin Role)
**The Vulnerability:** The program checks if a user claims to be an admin but fails to verify if the signer *actually matches* the stored admin address.
* **Vulnerable:** Trusts the client-side wallet address without validating it against the state.
* **Secure:** Uses the `#[account(has_one = admin)]` constraint to automatically verify the signer's identity.

### 3. PDA Verification (The Locksmith’s Error)
**The Vulnerability:** Using a user-provided PDA without verifying that it matches the "Canonical Bump." This allows attackers to create "fake" PDAs that bypass logic.
* **Vulnerable:** Manually derives an address but doesn't check if the user's input matches.
* **Secure:** Uses Anchor's `seeds = [...], bump` constraint to automatically re-derive and validate the address.

### 4. Owner Check (The Trojan Horse)
**The Vulnerability:** The program interacts with an account it assumes is a Token Account, but it's actually an account owned by a malicious program.
* **Vulnerable:** Fails to verify `account.owner == Token_Program_ID`.
* **Secure:** Employs the `#[account(owner = ...)]` constraint or Anchor's `Account<'info, TokenAccount>` wrapper.

### 5. Integer Overflow (The Infinite Mint)
**The Vulnerability:** Using standard math (`+`, `-`) in older Rust/Solana versions, allowing numbers to wrap around (e.g., `0 - 1 = 2^64 - 1`).
* **Vulnerable:** Raw `balance -= amount;` or `wrapping_add`.
* **Secure:** Uses `checked_add` or `checked_sub` to safely handle arithmetic.

---

## ⚡ Anchor vs. Pinocchio: The Safety Spectrum

This project also explores the **Pinocchio Framework**. While Anchor provides **Macros** (Heavy Armor) that handle these checks automatically, Pinocchio offers **Minimalist Efficiency** (The Scalpel).

* **Anchor:** Best for rapid, secure development where the framework handles the "boring" security checks.
* **Pinocchio:** Best for high-performance instructions where every compute unit counts, but requires the developer to manually write every check listed above.

---

## 🧪 Running the "Heist" Tests

Each module includes a "Capture The Flag" style test.

1. **The Hack:** Successfully exploits the `vulnerable` module.
2. **The Shield:** Attempts the same hack on the `secure` module and fails.

```bash
anchor test

```

*Look for the 🥷 and 🛡️ emojis in your terminal output!*

---

## 🏆 Bounty Requirements Checklist

* [x] **5+ Programs:** Cover 5 distinct real-world attack patterns.
* [x] **Side-by-Side:** `mod vulnerable` vs `mod secure` in every file.
* [x] **Educational Content:** Full interactive portal + Deep-dive README.
* [x] **Open Source:** MIT Licensed.

