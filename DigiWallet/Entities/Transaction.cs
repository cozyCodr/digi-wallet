

using static DigiWallet.Entities.Constants;

namespace DigiWallet.Entities
{

    public class Transaction
    {
        public Guid Id { get; private set; }
        public Guid SenderWalletId { get; private set; }
        public Guid ReceiverWalletId { get; private set; }
        public Money Amount { get; private set; }
        public DateTime Timestamp { get; private set; }
        public string Type { get; private set; }
        public string Description { get; private set; }
        public TransactionStatus Status { get; private set; }

        public Wallet SenderWallet { get; private set; }
        public Wallet ReceiverWallet { get; private set; }

        public static Transaction Create(
            Wallet senderWallet, 
            Wallet receiverWallet, 
            Money amount, 
            string type, 
            string description)
        {
            if (senderWallet == null)
            {
                throw new ArgumentNullException(nameof(senderWallet));
            }
            if (receiverWallet == null)
            {
                throw new ArgumentNullException(nameof(receiverWallet));
            }
            if (amount == null)
            {
                throw new ArgumentNullException(nameof(amount));
            }

            return new Transaction
            {
                Id = Guid.NewGuid(),
                SenderWalletId = senderWallet.Id,
                ReceiverWalletId = receiverWallet.Id,
                Amount = amount,
                Timestamp = DateTime.UtcNow,
                Status = TransactionStatus.Pending,
                Type = type,
                Description = description
            };
        }

        public void Complete()
        {
            Status = TransactionStatus.Completed;
        }

        public void Fail()
        {
            Status = TransactionStatus.Failed;
        }
    }
}