using System.Text.Json.Serialization;

namespace Backend.Domain.src.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRole
    {
        Admin,
        Customer
    }
}