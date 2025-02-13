using DigiWallet.Entities;
using Microsoft.EntityFrameworkCore;

namespace DigiWallet.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<OutboxMessage> OutboxMessages { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
    
            // Relationships
            modelBuilder.Entity<User>()
                .HasOne(user => user.Wallet)
                .WithOne(wallet => wallet.User)
                .HasForeignKey<Wallet>(wallet => wallet.UserId);

            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.SentTransactions)
                .WithOne(t => t.SenderWallet)
                .HasForeignKey(t => t.SenderWalletId)
                .OnDelete(DeleteBehavior.Restrict); 
    
            modelBuilder.Entity<Wallet>()
                .HasMany(w => w.ReceivedTransactions)
                .WithOne(t => t.ReceiverWallet)
                .HasForeignKey(t => t.ReceiverWalletId)
                .OnDelete(DeleteBehavior.Restrict);
    
            // Configure Money as owned entity
            modelBuilder.Entity<Wallet>().OwnsOne(w => w.Balance, balance =>
            {
                balance.Property(m => m.Amount).HasColumnName("BalanceAmount");
                balance.Property(m => m.Currency).HasColumnName("BalanceCurrency").HasMaxLength(3);
            });

            modelBuilder.Entity<Transaction>().OwnsOne(t => t.Amount, amount =>
            {
                amount.Property(m => m.Amount).HasColumnName("TransactionAmount");
                amount.Property(m => m.Currency).HasColumnName("TransactionCurrency").HasMaxLength(3);
            });
    
            // Configure OutboxMessage - Updated for PostgreSQL compatibility
            modelBuilder.Entity<OutboxMessage>(builder =>
            {
                builder.HasKey(x => x.Id);
                builder.Property(x => x.Type)
                    .IsRequired()
                    .HasMaxLength(255);
        
                builder.Property(x => x.Data)
                    .IsRequired()
                    .HasColumnType("text"); // Use 'text' instead of 'nvarchar(max)'
        
                builder.Property(x => x.OccurredOnUtc)
                    .IsRequired();
        
                builder.Property(x => x.ProcessedOnUtc)
                    .IsRequired(false);
            });
        }
        
    }
}