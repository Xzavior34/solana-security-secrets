// Signer Authorization Vulnerability - Educational Content
// The Vault of Glass: A Solana Security Story

export const VAULT_SCENARIO = {
  title: "The Vault of Glass",
  subtitle: "A Tale of Missing Signatures",
  description: `
In the gleaming towers of the Solana blockchain, there exists a legendary vault known as 
"The Vault of Glass" — a smart contract holding millions in SOL. Its creators believed 
it was impenetrable, transparent yet secure. But they made one fatal mistake...

They forgot to check if the person requesting a withdrawal was actually authorized to do so.

This is the story of how a missing signer verification turned a fortress into a house of cards.
  `.trim(),
  analogy: {
    title: "The Valet Deception",
    content: `
Imagine you're at a luxury hotel. You hand your car keys to someone wearing a valet uniform.
But here's the thing — you never checked if they actually work for the hotel.

In Solana terms:
🔑 Your car keys = Your funds in the vault
👔 The valet uniform = A properly formatted transaction  
🏨 The hotel = The smart contract
❌ Missing ID check = Missing signer verification

Anyone can put on a uniform. The question is: Did you verify their credentials?
    `.trim()
  }
};

export const ASCII_ATTACK_FLOW = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🥷 THE SIGNER AUTHORIZATION ATTACK                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ┌─────────────┐         ┌─────────────────────┐        ┌─────────────┐   ║
║    │             │         │                     │        │             │   ║
║    │   ATTACKER  │────────▶│   VAULT CONTRACT    │───────▶│   VICTIM'S  │   ║
║    │    🥷        │         │      🏦              │        │   WALLET    │   ║
║    │             │         │                     │        │    💰       │   ║
║    └─────────────┘         └─────────────────────┘        └─────────────┘   ║
║          │                          │                            │          ║
║          │                          │                            │          ║
║          ▼                          ▼                            ▼          ║
║    ┌─────────────┐         ┌─────────────────────┐        ┌─────────────┐   ║
║    │  1. Create  │         │  2. Contract asks:  │        │  3. Funds   │   ║
║    │  malicious  │         │  "Is this a valid   │        │  STOLEN!    │   ║
║    │  withdraw   │         │   account?"         │        │             │   ║
║    │  instruction│         │                     │        │   💸💸💸    │   ║
║    │             │         │  ❌ Never checks:   │        │             │   ║
║    │             │         │  "Did owner sign?"  │        │             │   ║
║    └─────────────┘         └─────────────────────┘        └─────────────┘   ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  ⚠️  THE BUG: Contract checks account exists, but NOT if owner authorized!  ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;

export const ASCII_SECURE_FLOW = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🛡️  THE SECURE AUTHORIZATION FLOW                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ┌─────────────┐         ┌─────────────────────┐        ┌─────────────┐   ║
║    │             │         │                     │        │             │   ║
║    │   ATTACKER  │────────▶│   VAULT CONTRACT    │───X───▶│   VICTIM'S  │   ║
║    │    🥷        │         │      🏦              │        │   WALLET    │   ║
║    │             │         │                     │        │    💰       │   ║
║    └─────────────┘         └─────────────────────┘        └─────────────┘   ║
║          │                          │                            │          ║
║          │                          │                            │          ║
║          ▼                          ▼                            ▼          ║
║    ┌─────────────┐         ┌─────────────────────┐        ┌─────────────┐   ║
║    │  1. Create  │         │  2. Contract asks:  │        │  3. TX      │   ║
║    │  malicious  │         │  "Is this a valid   │        │  REJECTED!  │   ║
║    │  withdraw   │         │   account?"  ✅     │        │             │   ║
║    │  instruction│         │                     │        │   🛑 STOP   │   ║
║    │             │         │  ✅ "Did owner      │        │             │   ║
║    │             │         │     sign this?" ❌  │        │   Funds     │   ║
║    │             │         │                     │        │   SAFE! 🔒  │   ║
║    └─────────────┘         └─────────────────────┘        └─────────────┘   ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  ✅  THE FIX: Add "Signer" constraint to verify owner authorized the TX!    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;

export const VULNERABLE_CODE = `use anchor_lang::prelude::*;

declare_id!("G1ass0000000000000000000000000000000000000");

// ============================================================================
// 🔴 VULNERABLE MODULE - THE VAULT OF GLASS (BROKEN VERSION)
// ============================================================================
// 
// ⚠️  TEACHER'S NOTE: This code contains a CRITICAL vulnerability!
// The withdraw function doesn't verify that the owner actually signed
// the transaction. Anyone can drain anyone else's vault!
//
// ============================================================================

pub mod vulnerable {
    use super::*;

    #[program]
    pub mod vault_of_glass_vulnerable {
        use super::*;

        /// Initialize a new vault for a user
        pub fn initialize(ctx: Context<InitializeVault>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            vault.owner = ctx.accounts.owner.key();
            vault.balance = amount;
            
            msg!("🏦 Vault initialized for: {}", vault.owner);
            msg!("💰 Initial balance: {} lamports", vault.balance);
            
            Ok(())
        }

        /// ⚠️ VULNERABLE: Withdraw funds from the vault
        /// 
        /// 🔴 CRITICAL BUG: This function does NOT verify that the \`owner\`
        /// account actually SIGNED this transaction!
        /// 
        /// An attacker can pass ANY owner's public key and drain their vault
        /// because we only check that the vault.owner MATCHES the passed account,
        /// but we never verify the owner AUTHORIZED this withdrawal!
        pub fn withdraw(ctx: Context<WithdrawVulnerable>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            
            // ✅ We check the owner matches... but that's not enough!
            require!(vault.owner == ctx.accounts.owner.key(), VaultError::Unauthorized);
            
            // 💀 DANGER: We never checked if owner actually SIGNED this!
            // Anyone can pass someone else's public key as "owner"
            // and steal their funds!
            
            require!(vault.balance >= amount, VaultError::InsufficientFunds);
            
            vault.balance -= amount;
            
            msg!("💸 Withdrew {} lamports", amount);
            msg!("📊 Remaining balance: {}", vault.balance);
            
            Ok(())
        }
    }

    // =========================================================================
    // 🔴 VULNERABLE ACCOUNT VALIDATION
    // =========================================================================

    #[derive(Accounts)]
    pub struct InitializeVault<'info> {
        #[account(init, payer = owner, space = 8 + 32 + 8)]
        pub vault: Account<'info, Vault>,
        #[account(mut)]
        pub owner: Signer<'info>,  // ✅ Correctly requires signature for init
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct WithdrawVulnerable<'info> {
        #[account(mut, has_one = owner)]
        pub vault: Account<'info, Vault>,
        
        // 💀💀💀 THE FATAL FLAW 💀💀💀
        // 
        // Notice: \`owner\` is just AccountInfo, NOT Signer!
        // This means we accept ANY public key without verifying
        // that the real owner signed this transaction.
        // 
        // An attacker workflow:
        // 1. Find victim's vault address
        // 2. Pass victim's pubkey as "owner" (no signature needed!)  
        // 3. Drain all funds to attacker's wallet
        // 
        /// CHECK: We "check" owner via has_one... but never verify signature!
        pub owner: AccountInfo<'info>,  // 🔴 WRONG! Should be Signer<'info>
    }

    #[account]
    pub struct Vault {
        pub owner: Pubkey,   // The owner's public key
        pub balance: u64,    // Current balance in lamports
    }

    #[error_code]
    pub enum VaultError {
        #[msg("Unauthorized access attempt")]
        Unauthorized,
        #[msg("Insufficient funds in vault")]
        InsufficientFunds,
    }
}`;

export const SECURE_CODE = `use anchor_lang::prelude::*;

declare_id!("G1ass0000000000000000000000000000000000000");

// ============================================================================
// 🟢 SECURE MODULE - THE VAULT OF GLASS (FIXED VERSION)
// ============================================================================
// 
// ✅ TEACHER'S NOTE: This version correctly implements signer verification.
// The ONLY change is on the \`owner\` field in WithdrawSecure - we changed
// AccountInfo to Signer. This single change prevents the entire attack!
//
// ============================================================================

pub mod secure {
    use super::*;

    #[program]
    pub mod vault_of_glass_secure {
        use super::*;

        /// Initialize a new vault for a user
        pub fn initialize(ctx: Context<InitializeVault>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            vault.owner = ctx.accounts.owner.key();
            vault.balance = amount;
            
            msg!("🏦 Vault initialized for: {}", vault.owner);
            msg!("💰 Initial balance: {} lamports", vault.balance);
            
            Ok(())
        }

        /// ✅ SECURE: Withdraw funds from the vault
        /// 
        /// This version requires the owner to cryptographically SIGN
        /// the transaction, proving they authorized the withdrawal.
        pub fn withdraw(ctx: Context<WithdrawSecure>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            
            // ✅ Owner match is verified by \`has_one\` constraint
            // ✅ Owner signature is verified by \`Signer\` type (see below)
            
            require!(vault.balance >= amount, VaultError::InsufficientFunds);
            
            vault.balance -= amount;
            
            msg!("✅ Secure withdrawal of {} lamports", amount);
            msg!("🔒 Owner signature verified!");
            msg!("📊 Remaining balance: {}", vault.balance);
            
            Ok(())
        }
    }

    // =========================================================================
    // 🟢 SECURE ACCOUNT VALIDATION
    // =========================================================================

    #[derive(Accounts)]
    pub struct InitializeVault<'info> {
        #[account(init, payer = owner, space = 8 + 32 + 8)]
        pub vault: Account<'info, Vault>,
        #[account(mut)]
        pub owner: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct WithdrawSecure<'info> {
        #[account(mut, has_one = owner)]
        pub vault: Account<'info, Vault>,
        
        // ✅✅✅ THE FIX ✅✅✅
        // 
        // By changing from AccountInfo to Signer, Anchor now:
        // 1. Verifies this account actually SIGNED the transaction
        // 2. Rejects any transaction where owner didn't sign
        // 3. Makes it cryptographically impossible to impersonate
        // 
        // Cost of the fix: Changing ONE WORD (AccountInfo → Signer)
        // Value of the fix: Preventing theft of all vault funds
        //
        #[account(mut)]
        pub owner: Signer<'info>,  // 🟢 CORRECT! Requires cryptographic signature
    }

    #[account]
    pub struct Vault {
        pub owner: Pubkey,
        pub balance: u64,
    }

    #[error_code]
    pub enum VaultError {
        #[msg("Unauthorized access attempt")]
        Unauthorized,
        #[msg("Insufficient funds in vault")]
        InsufficientFunds,
    }
}`;

export const FULL_LIB_RS = `// ============================================================================
// 🔐 SOLANA SECURITY ACADEMY - SIGNER AUTHORIZATION VULNERABILITY
// ============================================================================
//
// 📚 TOPIC: Missing Signer Verification
// 🎭 SCENARIO: The Vault of Glass
// 👨‍🏫 LEVEL: Critical / Beginner-Intermediate
//
// This file contains TWO implementations of the same vault contract:
// 1. mod vulnerable - Contains the exploit
// 2. mod secure - Contains the fix
//
// Study both carefully. The difference is ONE WORD that saves millions.
//
// ============================================================================

use anchor_lang::prelude::*;

declare_id!("G1ass0000000000000000000000000000000000000");

// ============================================================================
// 🔴 VULNERABLE MODULE - THE VAULT OF GLASS (BROKEN VERSION)
// ============================================================================

pub mod vulnerable {
    use super::*;

    #[program]
    pub mod vault_of_glass_vulnerable {
        use super::*;

        pub fn initialize(ctx: Context<InitializeVaultV>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            vault.owner = ctx.accounts.owner.key();
            vault.balance = amount;
            msg!("🏦 Vault initialized for: {}", vault.owner);
            Ok(())
        }

        // 💀 VULNERABLE FUNCTION
        pub fn withdraw(ctx: Context<WithdrawVulnerable>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            require!(vault.balance >= amount, VaultError::InsufficientFunds);
            vault.balance -= amount;
            msg!("💸 Withdrew {} lamports", amount);
            Ok(())
        }
    }

    #[derive(Accounts)]
    pub struct InitializeVaultV<'info> {
        #[account(init, payer = owner, space = 8 + 32 + 8)]
        pub vault: Account<'info, Vault>,
        #[account(mut)]
        pub owner: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct WithdrawVulnerable<'info> {
        #[account(mut, has_one = owner)]
        pub vault: Account<'info, Vault>,
        /// CHECK: 🔴 VULNERABLE - No signature verification!
        pub owner: AccountInfo<'info>,  // 💀 THE BUG!
    }

    #[account]
    pub struct Vault {
        pub owner: Pubkey,
        pub balance: u64,
    }
}

// ============================================================================
// 🟢 SECURE MODULE - THE VAULT OF GLASS (FIXED VERSION)  
// ============================================================================

pub mod secure {
    use super::*;

    #[program]
    pub mod vault_of_glass_secure {
        use super::*;

        pub fn initialize(ctx: Context<InitializeVaultS>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            vault.owner = ctx.accounts.owner.key();
            vault.balance = amount;
            msg!("🏦 Vault initialized for: {}", vault.owner);
            Ok(())
        }

        // ✅ SECURE FUNCTION
        pub fn withdraw(ctx: Context<WithdrawSecure>, amount: u64) -> Result<()> {
            let vault = &mut ctx.accounts.vault;
            require!(vault.balance >= amount, VaultError::InsufficientFunds);
            vault.balance -= amount;
            msg!("✅ Secure withdrawal of {} lamports", amount);
            Ok(())
        }
    }

    #[derive(Accounts)]
    pub struct InitializeVaultS<'info> {
        #[account(init, payer = owner, space = 8 + 32 + 8)]
        pub vault: Account<'info, Vault>,
        #[account(mut)]
        pub owner: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct WithdrawSecure<'info> {
        #[account(mut, has_one = owner)]
        pub vault: Account<'info, Vault>,
        #[account(mut)]
        pub owner: Signer<'info>,  // ✅ THE FIX!
    }

    #[account]
    pub struct Vault {
        pub owner: Pubkey,
        pub balance: u64,
    }
}

#[error_code]
pub enum VaultError {
    #[msg("Unauthorized access attempt")]
    Unauthorized,
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
}

// ============================================================================
// 🧪 PINOCCHIO COMPARISON
// ============================================================================
//
// In Pinocchio (low-level Solana programming), you would need to manually
// verify signers. Here's how the vulnerability manifests:
//
// VULNERABLE (Pinocchio):
// \`\`\`rust
// pub fn process_withdraw(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
//     let owner = &accounts[1];
//     // ❌ We never check: owner.is_signer
//     // Anyone can pass any pubkey!
//     ...
// }
// \`\`\`
//
// SECURE (Pinocchio):
// \`\`\`rust  
// pub fn process_withdraw(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
//     let owner = &accounts[1];
//     // ✅ Manual signer check required!
//     if !owner.is_signer {
//         return Err(ProgramError::MissingRequiredSignature);
//     }
//     ...
// }
// \`\`\`
//
// 📊 COMPARISON:
// - Anchor: Uses type system (Signer<'info>) - harder to forget
// - Pinocchio: Manual check (is_signer) - easier to forget but more control
//
// 💡 VERDICT: Pinocchio is HARDER (more room for human error).
//    Anchor's type system makes this vulnerability category nearly impossible
//    if you use the right types. But Pinocchio gives you more gas efficiency.
//
// ============================================================================
`;

export const TEST_CODE = `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultOfGlass } from "../target/types/vault_of_glass";
import { expect } from "chai";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

// ============================================================================
// 🔐 SOLANA SECURITY ACADEMY - SIGNER AUTHORIZATION TESTS
// ============================================================================
//
// These tests demonstrate:
// 1. 🥷 The Heist - Successfully exploiting the vulnerable contract
// 2. 🛡️ The Shield - Proving the secure contract blocks the attack
//
// ============================================================================

describe("🔐 Vault of Glass - Signer Authorization", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultOfGlass as Program<VaultOfGlass>;
  
  // Create test wallets
  const victim = Keypair.generate();
  const attacker = Keypair.generate();
  
  const INITIAL_DEPOSIT = 10 * LAMPORTS_PER_SOL;
  const STEAL_AMOUNT = 5 * LAMPORTS_PER_SOL;

  before(async () => {
    // Fund test accounts
    console.log("\\n🔧 Setting up test environment...");
    console.log("├── Victim pubkey:", victim.publicKey.toBase58().slice(0, 20) + "...");
    console.log("└── Attacker pubkey:", attacker.publicKey.toBase58().slice(0, 20) + "...");
    
    // Airdrop SOL to victim and attacker
    await provider.connection.requestAirdrop(victim.publicKey, 100 * LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(attacker.publicKey, 10 * LAMPORTS_PER_SOL);
  });

  // ==========================================================================
  // 🥷 TEST A: THE HEIST (Exploiting Vulnerable Contract)
  // ==========================================================================
  
  describe("🥷 THE HEIST - Vulnerable Contract Exploit", () => {
    let vulnerableVaultPda: anchor.web3.PublicKey;
    
    it("💰 Victim deposits funds into vulnerable vault", async () => {
      console.log("\\n╔════════════════════════════════════════╗");
      console.log("║   🏦 VICTIM DEPOSITS INTO VAULT         ║");
      console.log("╚════════════════════════════════════════╝\\n");
      
      [vulnerableVaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), victim.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeVulnerable(new anchor.BN(INITIAL_DEPOSIT))
        .accounts({
          vault: vulnerableVaultPda,
          owner: victim.publicKey,
        })
        .signers([victim])
        .rpc();

      const vaultAccount = await program.account.vault.fetch(vulnerableVaultPda);
      console.log("📊 Vault Status:");
      console.log("├── Owner:", vaultAccount.owner.toBase58().slice(0, 20) + "...");
      console.log("└── Balance:", vaultAccount.balance.toNumber() / LAMPORTS_PER_SOL, "SOL");
      
      expect(vaultAccount.balance.toNumber()).to.equal(INITIAL_DEPOSIT);
    });

    it("🥷 Attacker drains vault WITHOUT owner's signature!", async () => {
      console.log("\\n╔════════════════════════════════════════╗");
      console.log("║   🥷 HACKING IN PROGRESS...              ║");
      console.log("╚════════════════════════════════════════╝\\n");
      
      console.log("⏳ Attacker preparing malicious transaction...");
      console.log("├── Target: Victim's vault");
      console.log("├── Method: Pass victim pubkey without signature");
      console.log("└── Amount: " + STEAL_AMOUNT / LAMPORTS_PER_SOL + " SOL\\n");
      
      // 🔴 THE EXPLOIT: We pass victim's pubkey but DON'T sign with their key!
      // We only sign with attacker's key (as the payer)
      await program.methods
        .withdrawVulnerable(new anchor.BN(STEAL_AMOUNT))
        .accounts({
          vault: vulnerableVaultPda,
          owner: victim.publicKey,  // Victim's pubkey passed...
        })
        .signers([attacker])  // ...but only ATTACKER signs!
        .rpc();

      const vaultAfter = await program.account.vault.fetch(vulnerableVaultPda);
      
      console.log("💰💰💰 FUNDS STOLEN SUCCESSFULLY! 💰💰💰\\n");
      console.log("📊 Vault Status After Attack:");
      console.log("├── Previous Balance:", INITIAL_DEPOSIT / LAMPORTS_PER_SOL, "SOL");
      console.log("├── Stolen Amount:", STEAL_AMOUNT / LAMPORTS_PER_SOL, "SOL");
      console.log("└── Remaining Balance:", vaultAfter.balance.toNumber() / LAMPORTS_PER_SOL, "SOL\\n");
      
      expect(vaultAfter.balance.toNumber()).to.equal(INITIAL_DEPOSIT - STEAL_AMOUNT);
      
      console.log("🎯 Exploit successful! The vulnerable contract didn't verify");
      console.log("   that the owner actually SIGNED the transaction.\\n");
    });
  });

  // ==========================================================================
  // 🛡️ TEST B: THE SHIELD (Secure Contract Blocks Attack)
  // ==========================================================================
  
  describe("🛡️ THE SHIELD - Secure Contract Defense", () => {
    let secureVaultPda: anchor.web3.PublicKey;
    
    it("💰 Victim deposits funds into SECURE vault", async () => {
      console.log("\\n╔════════════════════════════════════════╗");
      console.log("║   🏦 VICTIM DEPOSITS INTO SECURE VAULT  ║");
      console.log("╚════════════════════════════════════════╝\\n");
      
      [secureVaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("secure-vault"), victim.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeSecure(new anchor.BN(INITIAL_DEPOSIT))
        .accounts({
          vault: secureVaultPda,
          owner: victim.publicKey,
        })
        .signers([victim])
        .rpc();

      const vaultAccount = await program.account.vault.fetch(secureVaultPda);
      console.log("📊 Secure Vault Status:");
      console.log("├── Owner:", vaultAccount.owner.toBase58().slice(0, 20) + "...");
      console.log("└── Balance:", vaultAccount.balance.toNumber() / LAMPORTS_PER_SOL, "SOL\\n");
      
      console.log("🔒 This vault uses Signer<'info> for owner verification!");
    });

    it("🛑 Attacker's exploit attempt is BLOCKED!", async () => {
      console.log("\\n╔════════════════════════════════════════╗");
      console.log("║   🥷 ATTACK ATTEMPT ON SECURE VAULT      ║");
      console.log("╚════════════════════════════════════════╝\\n");
      
      console.log("⏳ Attacker attempting same exploit...");
      console.log("├── Target: Victim's SECURE vault");
      console.log("├── Method: Pass victim pubkey without signature");
      console.log("└── Expected: ❌ TRANSACTION REJECTED\\n");
      
      try {
        await program.methods
          .withdrawSecure(new anchor.BN(STEAL_AMOUNT))
          .accounts({
            vault: secureVaultPda,
            owner: victim.publicKey,
          })
          .signers([attacker])  // Only attacker signs
          .rpc();
          
        // If we get here, the test should fail!
        expect.fail("❌ Attack should have been blocked!");
        
      } catch (error: any) {
        console.log("🛡️🛡️🛡️ ATTACK BLOCKED! 🛡️🛡️🛡️\\n");
        console.log("Error received:", error.message.slice(0, 80) + "...\\n");
        
        // Verify it's the right error (missing signature)
        expect(error.message).to.include("Signature verification failed");
        
        console.log("✅ The Signer<'info> constraint required the owner's");
        console.log("   cryptographic signature, which the attacker cannot provide!\\n");
      }
      
      // Verify funds are still intact
      const vaultAfter = await program.account.vault.fetch(secureVaultPda);
      console.log("📊 Secure Vault Status After Attack Attempt:");
      console.log("└── Balance: " + vaultAfter.balance.toNumber() / LAMPORTS_PER_SOL + " SOL (UNCHANGED!)\\n");
      
      expect(vaultAfter.balance.toNumber()).to.equal(INITIAL_DEPOSIT);
      
      console.log("╔════════════════════════════════════════════════════════════╗");
      console.log("║  🎓 LESSON LEARNED: Always use Signer<'info> for accounts  ║");
      console.log("║     that must authorize transactions!                       ║");
      console.log("╚════════════════════════════════════════════════════════════╝\\n");
    });
  });
});
`;

export const README_CONTENT = `# 🔐 The Fake ID Attack: Signer Authorization Vulnerability

> **A deep dive into Solana's most fundamental security flaw**

---

## 📊 Attack Flow Visualization

\`\`\`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🥷 THE SIGNER AUTHORIZATION ATTACK                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ┌─────────────┐         ┌─────────────────────┐        ┌─────────────┐   ║
║    │   ATTACKER  │────────▶│   VAULT CONTRACT    │───────▶│   VICTIM'S  │   ║
║    │    🥷        │         │      🏦              │        │   WALLET 💰 │   ║
║    └─────────────┘         └─────────────────────┘        └─────────────┘   ║
║          │                          │                            │          ║
║          ▼                          ▼                            ▼          ║
║    ┌─────────────┐         ┌─────────────────────┐        ┌─────────────┐   ║
║    │  1. Create  │         │  2. Contract asks:  │        │  3. Funds   │   ║
║    │  malicious  │         │  "Is this valid?"   │        │  STOLEN!    │   ║
║    │  withdraw   │         │  ❌ Never checks:   │        │   💸💸💸    │   ║
║    │  instruction│         │  "Did owner sign?"  │        │             │   ║
║    └─────────────┘         └─────────────────────┘        └─────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
\`\`\`

---

## 🎭 The Analogy: The Valet Deception

> Imagine you're at a luxury hotel. You hand your car keys to someone wearing a valet uniform.
> But here's the thing — **you never checked if they actually work for the hotel.**

| Real World | Solana Equivalent |
|------------|-------------------|
| 🔑 Your car keys | Your funds in the vault |
| 👔 The valet uniform | A properly formatted transaction |
| 🏨 The hotel | The smart contract |
| ❌ Missing ID check | Missing signer verification |

**Anyone can put on a uniform. The question is: Did you verify their credentials?**

---

## 🔴 The Exploit: Step-by-Step

### Step 1: 🔍 Reconnaissance
\`\`\`bash
# Attacker finds a victim's vault address on-chain
solana account <VICTIM_VAULT_ADDRESS>
\`\`\`

### Step 2: 🎭 Craft the Malicious Transaction
\`\`\`typescript
// Attacker creates withdraw instruction
await program.methods
  .withdraw(stealAmount)
  .accounts({
    vault: victimVaultPda,
    owner: victim.publicKey,  // ⚠️ Victim's pubkey, NOT attacker's!
  })
  .signers([attacker])  // 💀 Only attacker signs!
  .rpc();
\`\`\`

### Step 3: 💸 Profit
The contract accepts the transaction because:
- ✅ The vault exists
- ✅ The \`owner\` field matches vault.owner  
- ❌ **Never checked if owner SIGNED the transaction!**

---

## 🟢 The Fix: One Word That Saves Millions

### ❌ Vulnerable Code
\`\`\`rust
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = owner)]
    pub vault: Account<'info, Vault>,
    
    /// CHECK: No signature verification!
    pub owner: AccountInfo<'info>,  // 💀 THE BUG
}
\`\`\`

### ✅ Secure Code
\`\`\`rust
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = owner)]
    pub vault: Account<'info, Vault>,
    
    // Requires cryptographic signature!
    pub owner: Signer<'info>,  // ✅ THE FIX
}
\`\`\`

### Why It Works

| Type | Verification |
|------|-------------|
| \`AccountInfo<'info>\` | ❌ Accepts any public key |
| \`Signer<'info>\` | ✅ Requires cryptographic proof of ownership |

**Anchor's \`Signer\` type automatically verifies that the account's private key signed the transaction.**

---

## 🔑 Key Takeaway

> 🎓 **"Never trust an account that hasn't proven its identity. Always use \`Signer<'info>\` for accounts that must authorize actions on their own assets."**

---

## 📁 Files in This Repository

| File | Description |
|------|-------------|
| \`lib.rs\` | Complete Anchor program with vulnerable + secure modules |
| \`signer-auth.test.ts\` | TypeScript tests demonstrating exploit and defense |
| \`README.md\` | This documentation |

---

## 🧪 Running the Tests

\`\`\`bash
# Build the program
anchor build

# Run tests (watch the terminal for the hacking simulation!)
anchor test
\`\`\`

---

## 🔗 Pinocchio Comparison

In Pinocchio (raw Solana development), you must manually check \`is_signer\`:

\`\`\`rust
// Pinocchio - Manual verification required
if !owner_account.is_signer {
    return Err(ProgramError::MissingRequiredSignature);
}
\`\`\`

**Verdict:** Pinocchio is **harder** (more room for human error). Anchor's type system makes this nearly impossible to forget.

---

## 🏆 SuperteamNG Bounty Submission

This educational resource was created for the **SuperteamNG Solana Security Bounty**.

**Author:** Security Academy  
**Topic:** Signer Authorization Vulnerability  
**Risk Level:** 🔴 Critical

---

<div align="center">

**Stay Safe. Verify Signatures. Build Secure.**

🛡️

</div>
`;

export const EXPLOIT_STEPS = [
  {
    step: 1,
    title: "🔍 Reconnaissance",
    description: "Attacker scans the blockchain for vault accounts with significant balances.",
    code: `// Find target vault
const vaultAddress = await findVaultByOwner(victimPubkey);
const balance = await getVaultBalance(vaultAddress);
console.log(\`Target acquired: \${balance} SOL\`);`,
    status: "Locating target..."
  },
  {
    step: 2,
    title: "🎭 Identity Spoofing",
    description: "Attacker crafts a transaction with the victim's public key, without needing their signature.",
    code: `// Create malicious instruction
const ix = await program.methods
  .withdraw(new BN(stealAmount))
  .accounts({
    vault: victimVault,
    owner: victim.publicKey,  // Victim's key!
  })
  .instruction();`,
    status: "Forging transaction..."
  },
  {
    step: 3,
    title: "📤 Transaction Submission",
    description: "The attacker submits the transaction, signing only with their own key.",
    code: `// Submit with ONLY attacker's signature
await sendAndConfirmTransaction(
  connection,
  new Transaction().add(ix),
  [attacker]  // Only attacker signs!
);`,
    status: "Bypassing authorization..."
  },
  {
    step: 4,
    title: "💰 Funds Extracted",
    description: "The vulnerable contract processes the withdrawal without verifying owner's signature.",
    code: `// Contract checks:
// ✅ vault.owner == passed_owner? YES
// ✅ balance >= amount? YES  
// ❌ Did owner SIGN? NEVER CHECKED!
// Result: Funds transferred to attacker`,
    status: "Draining funds..."
  }
];

export const FIX_EXPLANATION = {
  title: "The One-Word Fix",
  before: {
    code: `/// CHECK: No verification!
pub owner: AccountInfo<'info>,`,
    explanation: "AccountInfo accepts ANY public key. There's no cryptographic verification that the owner authorized this transaction."
  },
  after: {
    code: `#[account(mut)]
pub owner: Signer<'info>,`,
    explanation: "Signer requires the account's private key to have signed the transaction. This is cryptographically unforgeable."
  },
  whyItWorks: [
    "Anchor's Signer type checks tx.signatures during deserialization",
    "If the signature is missing or invalid, the transaction fails BEFORE your code runs",
    "Attackers cannot forge signatures without the private key",
    "This makes impersonation mathematically impossible"
  ],
  goldenRule: "Always use Signer<'info> for any account that must authorize actions on its own assets or data."
};

export const DANGEROUS_LINES = [37, 38, 39, 40, 71, 72, 73, 74, 75, 76, 77, 78];
export const SECURE_LINES = [83, 84, 85];
export const ANNOTATIONS: Record<number, string> = {
  37: "🔴 CRITICAL: This withdraw function accepts owner without verifying they signed the transaction!",
  71: "💀 THE FATAL FLAW: AccountInfo<'info> does NOT require a signature. Anyone can pass any public key here.",
  72: "⚠️ The 'CHECK' comment is a lie - we're not actually checking anything meaningful!",
  78: "🔴 This single line is the entire vulnerability. Change AccountInfo to Signer and the exploit is impossible.",
  83: "✅ THE FIX: Signer<'info> cryptographically verifies the owner signed this transaction.",
  84: "🟢 Now the Solana runtime will reject any transaction where owner's private key didn't sign.",
  85: "✅ Cost: One word change. Value: All funds protected."
};
