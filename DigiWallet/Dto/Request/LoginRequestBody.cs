using System.ComponentModel.DataAnnotations;

namespace DigiWallet.Dto.Request;

public class LoginRequestBody
{
    [Required(ErrorMessage = "Username is required")] 
    public string username { get; set; }
    [Required(ErrorMessage = "Password is required")] 
    public string password { get; set; }
}