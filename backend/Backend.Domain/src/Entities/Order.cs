using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Domain.src.Entities
{
    public class Order : BaseEntityWithId
    {
        public User User { get; set; }
        public string Recipient { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public OrderStatus Status { get; set; }
        public List<OrderProduct> OrderProducts { get; set; }
    }
}