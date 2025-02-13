namespace DigiWallet.Interfaces;


public interface IMessageBus
{
    Task Publish(string type, object data);
}
