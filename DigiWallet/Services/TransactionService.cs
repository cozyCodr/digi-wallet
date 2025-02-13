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

public interface ITransactionService
{
    public Task<ActionResult<ApiResponseBody>>  Transfer(TransferRequestBody body, string authorizationHeader);
    public Task<ActionResult<ApiResponseBody>> TopUp(TopUpRequestBody body, string authHeader);
    public ActionResult<ApiResponseBody> GetPaginatedTransactions(string authHeader, int pageNumber, int pageSize);
}

public class TransactionService(AppDbContext context, IMessageBus messageBus, IJwtService jwtService)
    : ITransactionService
{
    public async Task<ActionResult<ApiResponseBody>> Transfer(TransferRequestBody body, string authHeader)
{
    try
    {
        using var transaction = await context.Database.BeginTransactionAsync();

        // Extract User ID from AuthHeader
        var senderId = jwtService.GetUserIdFromAuthHeader(authHeader);
            
        var senderWallet = await context.Wallets
            .Include(w => w.User)
            .FirstOrDefaultAsync(w => w.UserId == senderId);

        var receiverWallet = await context.Wallets
            .Include(w => w.User)
            .FirstOrDefaultAsync(w => w.Id == body.ReceiverWalletId);

        if (senderWallet == null || receiverWallet == null)
        {
            return BuildErrorResponse(NotFound, "One or more wallets not found.");
        }

        if (senderWallet.Balance.Amount < body.Amount)
        {
            return BuildErrorResponse(BadRequest, "Insufficient funds.");
        }

        // Transfer Operation
        senderWallet.Withdraw(Money.Create(body.Amount, ZMW.ToString()));
        receiverWallet.Deposit(Money.Create(body.Amount, ZMW.ToString()));

        // Create a transaction record
        var transactionRecord = Transaction
            .Create(
                senderWallet, 
                receiverWallet, 
                Money.Create(body.Amount, ZMW.ToString()),
                body.Type,
                body.Description
            );
        
        context.Transactions.Add(transactionRecord);

        // Mark entities as modified
        context.Entry(senderWallet).State = EntityState.Modified;
        context.Entry(receiverWallet).State = EntityState.Modified;

        await context.SaveChangesAsync(); // Save all changes to the database
        await transaction.CommitAsync(); // Commit the transaction

        // Refresh the entities from the database
        await context.Entry(senderWallet).ReloadAsync();
        await context.Entry(receiverWallet).ReloadAsync();

        // 3. Publish the "TransactionCompleted" message
        _ = messageBus.Publish("TransactionCompleted", new { TransactionId = transactionRecord.Id });

        // 4. Build and return the success response
        var data = new
        {
            balance = senderWallet.Balance.Amount,
            transaction = new
            {
                transactionRecord.Id,
                sender = senderWallet.User.Username,
                receiver = receiverWallet.User.Username,
                amount = transactionRecord.Amount.Amount,
                currency = transactionRecord.Amount.Currency,
                transactionRecord.Type,
                transactionRecord.Description,
                transactionRecord.Timestamp
            }
        };
            
        return BuildSuccessResponse(OK, "Money Transferred", data);
    }
    catch (Exception e)
    {
        // Log the exception details
        Console.WriteLine($"Exception: {e.Message}");
        Console.WriteLine($"Stack Trace: {e.StackTrace}");
        return BuildErrorResponse(InternalServerError, e.Message);
    }
}
    
    
    public async Task<ActionResult<ApiResponseBody>> TopUp(TopUpRequestBody body, string authHeader)
    {
        try
        {
            using var transaction = context.Database.BeginTransaction();

            // Extract User ID from AuthHeader
            var userId = jwtService.GetUserIdFromAuthHeader(authHeader);

            var userWallet = context.Wallets.FirstOrDefault(w => w.UserId == userId);

            if (userWallet == null)
            {
                throw new NotFoundException("User wallet Not found");
            }

            // Transfer Operation
            userWallet.Deposit(Money.Create(body.Amount, ZMW.ToString()));

            // Create a transaction record
            var transactionRecord = Transaction
                .Create(
                    userWallet,
                    userWallet,
                    Money.Create(body.Amount, ZMW.ToString()),
                    body.Type,
                    body.Description
                );
            context.Transactions.Add(transactionRecord);
            // Mark the wallet as modified
            context.Entry(userWallet).State = EntityState.Modified;

            await context.SaveChangesAsync(); // Save all changes to the database
            await transaction.CommitAsync();

            // 3. Publish the "TransactionCompleted" message
            // _ = messageBus.Publish("TransactionCompleted", new { TransactionId = transactionRecord.Id });
            await context.Entry(userWallet).ReloadAsync();
            
            // 4. Build and return the success response
            var data = new
            {
                balance = userWallet.Balance.Amount,
                transaction = new
                {
                    transactionRecord.Id,
                    sender = transactionRecord.SenderWallet?.User?.Username,
                    receiver = transactionRecord.ReceiverWallet?.User?.Username,
                    transactionRecord.Amount,
                    transactionRecord.Type,
                    transactionRecord.Description,
                    transactionRecord.Timestamp
                }
            };

            return BuildSuccessResponse(OK, "Wallet Loaded", data);
        }
        catch (NotFoundException e)
        {
            return BuildErrorResponse(NotFound, e.Message);
        }
        catch (Exception e)
        {
            // Log the exception details
            Console.WriteLine($"Exception: {e.Message}");
            Console.WriteLine($"Stack Trace: {e.StackTrace}");
            return BuildErrorResponse(InternalServerError, e.Message);
        }
    }
    
    public ActionResult<ApiResponseBody> GetPaginatedTransactions(string authHeader, int pageNumber, int pageSize)
    {
        try
        {
            // Extract User ID from AuthHeader
            var userId = jwtService.GetUserIdFromAuthHeader(authHeader);

            // Fetch paginated transactions for the user
            var transactions = context.Transactions
                .AsNoTracking() // Add this line to make the query non-tracking
                .Where(t => t.SenderWallet.UserId == userId || t.ReceiverWallet.UserId == userId)
                .OrderByDescending(t => t.Timestamp)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new
                {
                    t.Id,
                    sender = t.SenderWallet.User.Username,
                    receiver = t.ReceiverWallet.User.Username,
                    receiverWalletId = t.ReceiverWallet.Id,
                    amount = t.Amount.Amount, // Only select the Amount value, not the entire Money object
                    currency = t.Amount.Currency, // Include the currency if needed
                    t.Type,
                    t.Description,
                    t.Timestamp
                })
                .ToList();

            var totalTransactions = context.Transactions
                .Count(t => t.SenderWallet.UserId == userId || t.ReceiverWallet.UserId == userId);

            var data = new
            {
                Transactions = transactions,
                TotalTransactions = totalTransactions,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return BuildSuccessResponse(OK, "Transactions fetched successfully", data);
        }
        catch (Exception e)
        {
            return BuildErrorResponse(InternalServerError, e.Message);
        }
    }
}