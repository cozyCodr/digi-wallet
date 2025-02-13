using DevOne.Security.Cryptography.BCrypt;

namespace DigiWallet.Entities
{

    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }

        // Nav Props
        public Wallet Wallet { get; set; }
        
        // Domain Events
        private readonly List<object> _domainEvents = new List<object>();
        public IReadOnlyCollection<object> DomainEvents => _domainEvents.AsReadOnly();

        private User() {}

        public static User Create(string username, string password, string email)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Username cannot be empty.", nameof(username));
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Password cannot be empty.", nameof(password));
            }
            
            // Hash Password
            var salt = BCryptHelper.GenerateSalt(18);
            var passwordHash = BCryptHelper.HashPassword(password, salt);
            
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = username,
                Password = passwordHash,
                Email = email,
                CreatedAt = DateTime.UtcNow,
                Wallet = Wallet.Create() // Auto-create wallet for new user.
            };
            
            // Raise domain event
            user._domainEvents.Add(new UserCreated { UserId = user.Id }); 

            return user;
        }
        
        // Method to update user details (with validation)
        public void UpdateEmail(string newEmail)
        {
            if (string.IsNullOrWhiteSpace(newEmail))
            {
                throw new ArgumentException("Email cannot be empty.", nameof(newEmail));
            }
            // Basic email validation
            if (!newEmail.Contains("@"))
            {
                throw new ArgumentException("Invalid Email Address", nameof(newEmail));
            }
            Email = newEmail;
        }
        
        public void ClearDomainEvents() => _domainEvents.Clear();
    }
    
    public class UserCreated
    {
        public Guid UserId { get; set; }
    }
}