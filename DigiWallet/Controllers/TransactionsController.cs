using System.Net;
using DigiWallet.Dto.Request;
using DigiWallet.Helpers;
using DigiWallet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static DigiWallet.Helpers.ResponseHelpers;

namespace DigiWallet.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    
    [HttpGet]
    [Authorize]
    public ActionResult<ApiResponseBody> GetPaginatedTransactions(
        [FromHeader(Name = "Authorization")] string authorizationHeader, 
        [FromQuery] int page = 1, 
        [FromQuery] int size = 10)
    {
        return transactionService.GetPaginatedTransactions(authorizationHeader, page, size);
    }
    
    [HttpPost("topup")]
    [Authorize]
    public async Task<ActionResult<ApiResponseBody>> TopUp([FromBody] TopUpRequestBody body, [FromHeader(Name = "Authorization")] string authorizationHeader)
    {
        return await transactionService.TopUp(body, authorizationHeader);
    }
    
    [HttpPost("transfer")]
    [Authorize]
    public async Task<ActionResult<ApiResponseBody>> Transfer(
        [FromBody] TransferRequestBody requestBody,
        [FromHeader(Name = "Authorization")] string authorizationHeader
        )
    {
        return !ModelState.IsValid 
            ? ReturnInvalidRequestBodyError() 
            : await transactionService.Transfer(requestBody, authorizationHeader);
    }
    
    
}