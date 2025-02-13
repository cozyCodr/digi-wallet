﻿namespace DigiWallet.Entities;

public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; }
    public string Data { get; set; }
    public DateTime OccurredOnUtc { get; set; }
    public DateTime? ProcessedOnUtc { get; set; }

}