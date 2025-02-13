using DigiWallet.Data;
using DigiWallet.Entities;
using DigiWallet.Exceptions;
using DigiWallet.Helpers;
using DigiWallet.Interfaces;
using Microsoft.AspNetCore.Mvc;
using static System.Net.HttpStatusCode;
using static DigiWallet.Helpers.ResponseHelpers;

namespace DigiWallet.Services;

public class ProfileService(IJwtService jwtService, AppDbContext context) : IProfileService
{
    public ActionResult<ApiResponseBody> GetUserProfile(string authorizationHeader)
    {
        try
        {
            using var transaction = context.Database.BeginTransaction();

            var userId = jwtService.GetUserIdFromAuthHeader(authorizationHeader);

            var user = context.Users.Find(userId);
            if (user == null) throw new NotFoundException("User not found");

            var userWallet = context.Wallets.FirstOrDefault(w => w.UserId == userId);
            if (userWallet == null) throw new NotFoundException("User has no wallet");

            var data = new
            {
                username =user.Username,
                email = user.Email,
                balance = userWallet.Balance.Amount,
                walletId = userWallet.Id
            };
            return BuildSuccessResponse(OK, "Profile fetched", data);
        }
        catch (NotFoundException e)
        {
            return BuildErrorResponse(NotFound, e.Message);
        }
        catch (Exception e)
        {
            return BuildErrorResponse(InternalServerError, e.Message);
        }
    }
}