using System.Text.Json.Serialization;

namespace Backend.Domain.src.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum OrderStatus
    {
        Pending, 
        AwaitingPayment, 
        AwaitingFulfillment,
        AwaitingShipment,
        AwaitingPickup, 
        AwaitingReturn,
        Shipped, 
        Cancelled, 
        Declined, 
        Refunded,
        Returned,
        Completed
    }
}