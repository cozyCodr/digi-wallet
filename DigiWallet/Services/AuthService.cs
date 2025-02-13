using DevOne.Security.Cryptography.BCrypt;
using DigiWallet.Data;
using DigiWallet.Dto.Request;
using DigiWallet.Entities;
using DigiWallet.Exceptions;
using DigiWallet.Helpers;
using Microsoft.AspNetCore.Mvc;
using static System.Net.HttpStatusCode;
using static DigiWallet.Helpers.ResponseHelpers;

namespace DigiWallet.Services;

public interface IAuthService
{
    public ActionResult<ApiResponseBody> Login(LoginRequestBody body);
    public ActionResult<ApiResponseBody> Register(RegisterRequestBody body);
}

public class AuthService(AppDbContext dbContext, IJwtService jwtService) : IAuthService
{
    public ActionResult<ApiResponseBody> Register(RegisterRequestBody body)
    {
        try
        {
            // Check if the username already exists
            if (dbContext.Users.Any(u => u.Username == body.username))
            {
                return BuildErrorResponse(UnprocessableEntity, "User with username already exists.");
            }

            if (dbContext.Users.Any(u => u.Email == body.email))
            {
                return BuildErrorResponse(UnprocessableEntity, "User with email already exists.");
            }

            // Create the user
            var user = User.Create(body.username, body.password, body.email);
            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return BuildSuccessResponse(Created, "User Created", new object());
        }
        catch (Exception e)
        {
            return BuildErrorResponse(InternalServerError, e.Message);
        }
    }

    public ActionResult<ApiResponseBody> Login(LoginRequestBody body)
    {
        try
        {
            // Find the user by username
            var user = dbContext.Users.FirstOrDefault(u => u.Username == body.username);

            // Check if the user exists and the password is correct
            if (user == null)
            {
                throw new NotFoundException("User with  username or email not found");
            }

            if (!BCryptHelper.CheckPassword(body.password, user.Password))
            {
                throw new ArgumentException("Invalid Password");
            }

            var token = jwtService.GenerateToken(user.Id, user.Username);
            var data = new
            {
                token,
                timestamp = DateTime.UtcNow
            };

            return BuildSuccessResponse(OK, "Authenticated", data);
        }
        catch (NotFoundException e)
        {
            return BuildErrorResponse(NotFound, e.Message);
        }
        catch (ArgumentException e)
        {
            return BuildErrorResponse(Unauthorized, e.Message);
        }
        catch (Exception e)
        {
            return BuildErrorResponse(InternalServerError, e.Message);
        }
    }   
}