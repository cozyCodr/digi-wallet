using static DigiWallet.Entities.Constants;

namespace DigiWallet.Entities
{

    public class Wallet
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public Money Balance { get; private set; }

        // Navigation Props
        public User User { get; private set; }
        public ICollection<Transaction> SentTransactions { get; private set; }
        public ICollection<Transaction> ReceivedTransactions { get; private set; }

        private Wallet()
        {
        }

        public static Wallet Create()
        {
            return new Wallet
            {
                Id = Guid.NewGuid(),
                Balance = Money.Create(0, Currencies.ZMW.ToString())
            };
        }

        public void Deposit(Money amount)
        {
            Balance = Balance.Add(amount);
        }

        public void Withdraw(Money amount)
        {
            if (Balance.Amount < amount.Amount)
            {
                throw new InvalidOperationException("Insufficient balance");
            }

            Balance = Balance.Subtract(amount);
        }
    }
}