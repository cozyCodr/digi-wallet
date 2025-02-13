using System.Net;
using DigiWallet.Dto.Request;
using DigiWallet.Helpers;
using DigiWallet.Interfaces;
using DigiWallet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static DigiWallet.Helpers.ResponseHelpers;

namespace DigiWallet.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    
    [HttpGet("search")]
    [Authorize]
    public Task<ActionResult<ApiResponseBody>> GetPaginatedTransactions(
        [FromQuery] string username,
        [FromHeader(Name = "Authorization")] string authHeader
        )
    {
        return userService.SearchUser(authHeader, username);
    }
    
    
}