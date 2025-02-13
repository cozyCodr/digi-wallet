using DigiWallet.Data;
using DigiWallet.Entities;
using DigiWallet.Interfaces;
using Newtonsoft.Json;

namespace DigiWallet.Util;

public class MessageBus(AppDbContext dbContext) : IMessageBus
{
    public async Task Publish(string type, object data)
    {
        var message = new OutboxMessage
        {
            Id = Guid.NewGuid(),
            Type = type,
            Data = JsonConvert.SerializeObject(data),
            OccurredOnUtc = DateTime.UtcNow
        };

        dbContext.OutboxMessages.Add(message);
        await dbContext.SaveChangesAsync();
    }
}