using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace DigiWallet.Helpers;

public abstract class ResponseHelpers
{
    public static ActionResult<ApiResponseBody> BuildSuccessResponse(HttpStatusCode status, string message, object data)
    {
        int statusCode = (int )status;

        var response = new ApiResponseBody
        {
            StatusCode = statusCode,
            Message = message,
            Data = data
        };

        return new ObjectResult(response)
        {
            StatusCode = statusCode
        };
    }
    
    
    public static ActionResult<ApiResponseBody> BuildErrorResponse(HttpStatusCode status, string message)
    {
        int statusCode = (int )status;

        var response = new ApiResponseBody
        {
            StatusCode = statusCode,
            Message = message,
        };

        return new ObjectResult(response)
        {
            StatusCode = statusCode
        };
    }

    public static ActionResult<ApiResponseBody> ReturnInvalidRequestBodyError()
    {
        return BuildErrorResponse(HttpStatusCode.BadRequest, "Invalid body");
    }
}