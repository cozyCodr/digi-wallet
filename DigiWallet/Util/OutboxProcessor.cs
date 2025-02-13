using DigiWallet.Data;
using Newtonsoft.Json;

namespace DigiWallet.Util;

// Background Worker
public class OutboxProcessor(IServiceProvider serviceProvider, ILogger<OutboxProcessor> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var messages = dbContext.OutboxMessages
                    .Where(m => m.ProcessedOnUtc == null)
                    .OrderBy(m => m.OccurredOnUtc)
                    .Take(10)
                    .ToList();

                foreach (var message in messages)
                {
                    try
                    {
                        // Resolve the handler based on the message type
                        // (You'll need a mechanism to map message types to handlers)
                        var handlerType = Type.GetType($"YourNamespace.MessageHandlers.{message.Type}Handler"); // Adjust namespace
                        if (handlerType != null)
                        {
                            var handler = scope.ServiceProvider.GetService(handlerType);

                            if (handler != null)
                            {
                                // Invoke the handler (you might need reflection)
                                var method = handlerType.GetMethod("Handle");
                                if (method != null)
                                {
                                    var data = JsonConvert.DeserializeObject(message.Data, method.GetParameters()[0].ParameterType);
                                    method.Invoke(handler, new[] { data });

                                    message.ProcessedOnUtc = DateTime.UtcNow;
                                    dbContext.SaveChanges();
                                    logger.LogInformation($"Processed message {message.Id}");
                                }
                                else
                                {
                                    logger.LogError($"Handle method not found on handler {handlerType.Name}");
                                }

                            }
                            else
                            {
                                logger.LogError($"Handler {handlerType.Name} not registered");
                            }
                        }
                        else
                        {
                            logger.LogError($"Handler type {message.Type} not found");
                        }


                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, $"Error processing message {message.Id}");
                    }
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken); // Polling interval
        }
    }
}