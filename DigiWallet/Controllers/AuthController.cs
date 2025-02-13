using Asp.Versioning;
using DigiWallet.Dto.Request;
using DigiWallet.Helpers;
using DigiWallet.Services;
using Microsoft.AspNetCore.Mvc;

namespace DigiWallet.Controllers;


[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class AuthController : ControllerBase
{

    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public ActionResult<ApiResponseBody> Login([FromBody] LoginRequestBody body)
    {
        return _authService.Login(body);
    }

    [HttpPost("register")]
    public ActionResult<ApiResponseBody> Register([FromBody] RegisterRequestBody body)
    {
        return _authService.Register(body);
    } 
}