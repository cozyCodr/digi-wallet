using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace DigiWallet.Services;


public interface IJwtService
{
    string GenerateToken(Guid userId, string username);
    public bool VerifyToken(string token);
    public bool ValidateToken(string token);
    public Guid? GetUserIdFromAuthHeader(string authHeader);
    public  Guid? GetUserIdFromToken(string token);
}

public class JwtService : IJwtService
{
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtService(IConfiguration configuration)
    {
        _secretKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? 
                     throw new InvalidOperationException("JWT Secret not configured");
        _issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? 
                  throw new InvalidOperationException("JWT Issuer not configured");
        _audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? 
                    throw new InvalidOperationException("JWT Audience not configured");
        
        if (string.IsNullOrEmpty(_secretKey))
        {
            throw new InvalidOperationException("JWT SecretKey is not configured.");
        }

        if (string.IsNullOrEmpty(_issuer))
        {
            throw new InvalidOperationException("JWT Issuer is not configured.");
        }

        if (string.IsNullOrEmpty(_audience))
        {
            throw new InvalidOperationException("JWT Audience is not configured.");
        }
    }

    public string GenerateToken(Guid userId, string username)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, username),   
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iss, _issuer),
            new Claim(JwtRegisteredClaimNames.Aud, _audience)
        };
        
        var token = new JwtSecurityToken(
            _issuer,
            _audience,
            claims,
            expires: DateTime.UtcNow.AddHours(2), // Token expiration time
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    public bool ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _issuer,
                    ValidAudience = _audience,
                    ClockSkew = TimeSpan.Zero // Remove delay of 5 minutes
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public Guid? GetUserIdFromAuthHeader(string authHeader)
        {
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return null;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            return GetUserIdFromToken(token);
        }

        public Guid? GetUserIdFromToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                // Extract the user ID from the "sub" claim (subject)
                var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

                if (Guid.TryParse(subClaim, out Guid userId))
                {
                    return userId;
                }

                return null;
            }
            catch
            {
                return null; // Token is invalid or malformed
            }
        }

        public bool VerifyToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _issuer,
                    ValidAudience = _audience,
                    ClockSkew = TimeSpan.Zero // Remove delay of 5 minutes
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                return true; // Token is valid
            }
            catch
            {
                return false; // Token is invalid
            }
        }
}