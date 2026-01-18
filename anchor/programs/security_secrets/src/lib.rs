use anchor_lang::prelude::*;

// ⚠️ IMPORTANT: Run 'anchor keys sync' after pasting this!
declare_id!("3cGtRVL7vjPyNYqNvfdn97XoLc4Pv6v4RLruk5Rr9zL7"); 

#[program]
pub mod security_secrets {
    use super::*;

    // ❌ VULNERABLE INSTRUCTION
    // This allows anyone to withdraw without a valid signature!
    pub fn withdraw_insecure(_ctx: Context<InsecureWithdraw>, amount: u64) -> Result<()> {
        // We log the theft. If this prints, the hack worked.
        msg!("💰 VULNERABILITY EXPLOITED! {} Lamports Stolen.", amount);
        Ok(())
    }

    // ✅ SECURE INSTRUCTION
    // This enforces proper checks.
    pub fn withdraw_secure(_ctx: Context<SecureWithdraw>, amount: u64) -> Result<()> {
        msg!("✅ Secure transaction executed.");
        Ok(())
    }

    // --- MODULE 2: TYPE COSPLAY ---
    pub fn update_profile_secure(ctx: Context<SecureType>, name: String) -> Result<()> {
        ctx.accounts.profile.name = name;
        Ok(())
    }
}

// --- CONTEXT STRUCTS ---

#[derive(Accounts)]
pub struct SecureWithdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>, 
    pub user: Signer<'info>,          
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InsecureWithdraw<'info> {
    /// CHECK: ❌ INSECURE: We accept raw AccountInfo without checking owner or signature!
    #[account(mut)]
    pub vault: AccountInfo<'info>, 
    /// CHECK: ❌ INSECURE: We trust this is the user without checking if they signed!
    #[account(mut)]
    pub user: AccountInfo<'info>, 
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SecureType<'info> {
    #[account(mut, has_one = authority)]
    pub profile: Account<'info, UserProfile>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Vault { pub admin: Pubkey, pub balance: u64 }

#[account]
pub struct UserProfile { pub name: String, pub authority: Pubkey }