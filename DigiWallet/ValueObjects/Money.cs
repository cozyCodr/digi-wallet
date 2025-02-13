using System;

namespace DigiWallet.Entities {

    public class Money : IEquatable<Money>
    {
        public decimal Amount { get; private set; }
        public string Currency { get; private set; }
        
        public Money () {}

        private Money(decimal amount, string currency)
        {
            Amount = amount;
            Currency = currency;
        }

        public static Money Create(decimal amount, string currency)
        {
            if (string.IsNullOrWhiteSpace(currency))
            {
                throw new ArgumentException("Currency cannot be empty!", nameof(currency));
            }

            if (amount < 0)
            {
                throw new ArgumentException("Amount cannot be negative.", nameof(amount));
            }

            return new Money(amount, currency);
        }

        public Money Add(Money other)
        {
            if (Currency != other.Currency)
            {
                throw new ArgumentException("Currencies must match for addition.");
            }

            return new Money(Amount + other.Amount, Currency);
        }

        public Money Subtract(Money other)
        {
            if (Currency != other.Currency)
            {
                throw new ArgumentException("Currencies must match for subtraction.");
            }

            return new Money(Amount - other.Amount, Currency);
        }


        public bool Equals(Money other)
        {
            if (other is null)
            {
                return false;
            }

            return Amount == other.Amount && Currency == other.Currency;
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as Money);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Amount, Currency);
        }

        public static bool operator ==(Money left, Money right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(Money left, Money right)
        {
            return !Equals(left, right);
        }
    }
}