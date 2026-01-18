use anchor_lang::prelude::*;

// ⚠️ IMPORTANT: Run 'anchor keys sync' after pasting this!
declare_id!("3cGtRVL7vjPyNYqNvfdn97XoLc4Pv6v4RLruk5Rr9zL7");

#[program]
pub mod security_secrets {
    use super::*;

    // --- MODULE 1: SIGNER AUTHORIZATION (The Vault Hack) ---
    // ❌ VULNERABLE: Allows anyone to withdraw without a valid signature!
    pub fn withdraw_insecure(_ctx: Context<InsecureWithdraw>, amount: u64) -> Result<()> {
        msg!("💰 VULNERABILITY EXPLOITED! {} Lamports Stolen via Missing Signer Check.", amount);
        Ok(())
    }

    // ✅ SECURE: Enforces signer check via 'Signer' type
    pub fn withdraw_secure(_ctx: Context<SecureWithdraw>, amount: u64) -> Result<()> {
        msg!("✅ Secure transaction executed (Signer Verified). Amount: {}", amount);
        Ok(())
    }

    // --- MODULE 2: INTEGER OVERFLOW (The Math Hack) ---
    // ❌ VULNERABLE: Rust allows overflow in release mode if using 'wrapping_add'
    pub fn overflow_insecure(ctx: Context<OverflowContext>, amount: u64) -> Result<()> {
        let account = &mut ctx.accounts.data_account;
        // Vulnerability: No check if adding 'amount' exceeds u64 limit
        account.balance = account.balance.wrapping_add(amount); 
        msg!("New Balance (Unchecked): {}", account.balance);
        Ok(())
    }

    // ✅ SECURE: Uses checked arithmetic
    pub fn overflow_secure(ctx: Context<OverflowContext>, amount: u64) -> Result<()> {
        let account = &mut ctx.accounts.data_account;
        // Secure: specific checked math
        account.balance = account.balance.checked_add(amount).ok_or(ProgramError::ArithmeticOverflow)?;
        msg!("New Balance (Secure): {}", account.balance);
        Ok(())
    }

    // --- MODULE 3: OWNER CHECK (The Fake Account Hack) ---
    // ❌ VULNERABLE: Accepts ANY account as 'token_account'
    pub fn owner_insecure(ctx: Context<OwnerContext>) -> Result<()> {
        let account = &ctx.accounts.token_account;
        // Vulnerability: We trust this account is owned by the token program, but it could be fake!
        msg!("Processing account: {:?}", account.key());
        Ok(())
    }

    // ✅ SECURE: Anchor checks owner automatically with TokenAccount type constraint
    pub fn owner_secure(_ctx: Context<SecureOwnerContext>) -> Result<()> {
        msg!("Account owner verified by Anchor constraints.");
        Ok(())
    }

    // --- MODULE 4: ADMIN ROLE (The Privilege Escalation) ---
    // ❌ VULNERABLE: Checks if user is "admin" but trusts the client
    pub fn role_insecure(ctx: Context<RoleContext>, _new_settings: u64) -> Result<()> {
        // Vulnerability: We didn't check if the signer is actually the admin saved in config!
        msg!("Settings updated by {:?}", ctx.accounts.user.key());
        Ok(())
    }

    // ✅ SECURE: Explicitly checks strict constraint
    pub fn role_secure(_ctx: Context<SecureRoleContext>, _new_settings: u64) -> Result<()> {
        // The struct constraint #[account(has_one = admin)] AUTOMATICALLY checks this.
        // We don't need manual code here. That's the beauty of Anchor!
        msg!("Settings updated by verified Admin.");
        Ok(())
    }

    // --- MODULE 5: PDA BUMP (The Map Hack) ---
    // ❌ VULNERABLE: Trusts the bump passed by the user
    pub fn pda_insecure(ctx: Context<PdaContext>, _bump: u8) -> Result<()> {
        // Vulnerability: We accept the bump provided by the user without verifying it's canonical
        msg!("PDA Account accessed: {:?}", ctx.accounts.pda_account.key());
        Ok(())
    }

    // ✅ SECURE: Recalculates and enforces canonical bump
    pub fn pda_secure(_ctx: Context<SecurePdaContext>) -> Result<()> {
        msg!("PDA verified with canonical bump.");
        Ok(())
    }
    
    // Bonus Helper
    pub fn update_profile_secure(ctx: Context<SecureType>, name: String) -> Result<()> {
        ctx.accounts.profile.name = name;
        Ok(())
    }
}

// --- CONTEXT STRUCTS ---

// 1. SIGNER STRUCTS
#[derive(Accounts)]
pub struct SecureWithdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>, 
    pub user: Signer<'info>,          
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InsecureWithdraw<'info> {
    /// CHECK: ❌ INSECURE: No signature check
    #[account(mut)]
    pub vault: AccountInfo<'info>, 
    /// CHECK: ❌ INSECURE: No signature check
    #[account(mut)]
    pub user: AccountInfo<'info>, 
    pub system_program: Program<'info, System>,
}

// 2. OVERFLOW STRUCTS
#[derive(Accounts)]
pub struct OverflowContext<'info> {
    #[account(mut)]
    pub data_account: Account<'info, Vault>,
}

// 3. OWNER CHECK STRUCTS
#[derive(Accounts)]
pub struct OwnerContext<'info> {
    /// CHECK: ❌ INSECURE: No owner check
    pub token_account: AccountInfo<'info>, 
}

#[derive(Accounts)]
pub struct SecureOwnerContext<'info> {
    // For demo purposes, we check against the system program or a known program ID
    #[account(constraint = token_account.owner == &system_program.key())] 
    pub token_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

// 4. ROLE STRUCTS
#[derive(Accounts)]
pub struct RoleContext<'info> {
    pub config: Account<'info, Vault>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct SecureRoleContext<'info> {
    #[account(has_one = admin)]
    pub config: Account<'info, Vault>,
    pub admin: Signer<'info>, 
}

// 5. PDA STRUCTS
#[derive(Accounts)]
pub struct PdaContext<'info> {
    /// CHECK: ❌ INSECURE: No seeds check
    pub pda_account: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SecurePdaContext<'info> {
    #[account(seeds = [b"secure-seed"], bump)]
    pub pda_account: Account<'info, Vault>,
}

// 6. TYPE COSPLAY STRUCTS
#[derive(Accounts)]
pub struct SecureType<'info> {
    #[account(mut, has_one = authority)]
    pub profile: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
}

// DATA ACCOUNTS
#[account]
pub struct Vault { pub admin: Pubkey, pub balance: u64 }

#[account]
pub struct UserProfile { pub name: String, pub authority: Pubkey }