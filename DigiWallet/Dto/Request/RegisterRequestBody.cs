using System.ComponentModel.DataAnnotations;

namespace DigiWallet.Dto.Request;

public class RegisterRequestBody
{
    [Required] public string username { get; set; }
    [Required] public string email { get; set; }
    [Required] public string password { get; set; }
}