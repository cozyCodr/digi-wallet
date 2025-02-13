using System.ComponentModel.DataAnnotations;

namespace DigiWallet.Dto.Request;

public class TransferRequestBody
{
    [Required(ErrorMessage = "Amount is Required")] 
    public  decimal Amount { get; set; }

    [Required(ErrorMessage = "Currency is Required")] 
    public string Currency { get; set; } = null!;
    
    [Required(ErrorMessage = "Please provide a type")] 
    public string Type { get; set; } = null!;
    
    [Required(ErrorMessage = "Please provide a type")] 
    public string Description { get; set; } = null!;
    
    [Required(ErrorMessage = "Receiver Wallet ID is Required")] 
    public Guid ReceiverWalletId { get; set; }
    
    
}