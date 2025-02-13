using DigiWallet.Dto.Request;
using DigiWallet.Helpers;
using DigiWallet.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static DigiWallet.Helpers.ResponseHelpers;

namespace DigiWallet.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProfileController(IProfileService profileService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public ActionResult<ApiResponseBody> Transfer(
        [FromHeader(Name = "Authorization")] string authorizationHeader
    )
    {
        return !ModelState.IsValid 
            ? ReturnInvalidRequestBodyError() 
            : profileService.GetUserProfile(authorizationHeader);
    }
}