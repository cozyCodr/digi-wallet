using DigiWallet.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace DigiWallet.Interfaces;

public interface IUserService
{
    public Task<ActionResult<ApiResponseBody>> SearchUser(string authHeader, string username);
}