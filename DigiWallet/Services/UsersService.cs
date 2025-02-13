using System.Net;
using DigiWallet.Data;
using DigiWallet.Dto.Request;
using DigiWallet.Entities;
using DigiWallet.Exceptions;
using DigiWallet.Helpers;
using DigiWallet.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.HttpStatusCode;
using static DigiWallet.Entities.Constants.Currencies;
using static DigiWallet.Helpers.ResponseHelpers;

namespace DigiWallet.Services;

public class UsersService(AppDbContext context, IMessageBus messageBus, IJwtService jwtService)
    : IUserService
{
    public async Task<ActionResult<ApiResponseBody>> SearchUser(string authHeader, string username)
    {
        try
        {
            // Extract User ID from AuthHeader to exclude the current user from results
            var currentUserId = jwtService.GetUserIdFromAuthHeader(authHeader);

            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Username search term cannot be empty");
            }

            // Search for users whose username contains the search term (case-insensitive)
            // Exclude the current user from the results
            var users = await context.Users
                .Where(u => u.Id != currentUserId &&
                            u.Username.ToLower().Contains(username.ToLower()))
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    walletId = u.Wallet.Id
                })
                .Take(10) // Limit results to 10 users
                .ToListAsync();

            if (!users.Any())
            {
                return BuildSuccessResponse(OK, "No users found", new { users = new List<object>() });
            }

            var data = new
            {
                users = users
            };

            return BuildSuccessResponse(OK, "Users found", data);
        }
        catch (ArgumentException e)
        {
            return BuildErrorResponse(BadRequest, e.Message);
        }
        catch (Exception e)
        {
            // Log the exception details
            Console.WriteLine($"Exception: {e.Message}");
            Console.WriteLine($"Stack Trace: {e.StackTrace}");
            return BuildErrorResponse(InternalServerError, e.Message);
        }
    }
    
    
}