using System.ComponentModel.DataAnnotations;

namespace DigiWallet.Dto.Request;

public class TopUpRequestBody
{
    [Required(ErrorMessage = "Amount is Required")] 
    public  decimal Amount { get; set; }
    
    [Required(ErrorMessage = "Please provide a type")] 
    public string Type { get; set; } = null!;
    
    [Required(ErrorMessage = "Please provide a type")] 
    public string Description { get; set; } = null!;
}