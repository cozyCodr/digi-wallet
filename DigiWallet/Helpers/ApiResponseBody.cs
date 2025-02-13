namespace DigiWallet.Helpers;

public class ApiResponseBody
{
    public int StatusCode { get; set; }
    public string Message  { get; set; }
    public object Data { get; set; }
}