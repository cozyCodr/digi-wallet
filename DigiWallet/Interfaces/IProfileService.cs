using DigiWallet.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace DigiWallet.Interfaces;

public interface IProfileService
{
    ActionResult<ApiResponseBody> GetUserProfile(string authorizationHeader);
}