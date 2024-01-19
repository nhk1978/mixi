using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Domain.src.Entities
{
    public class OrderProduct : BaseEntity
    {
        public Product Product { get; set; }
        public Order Order { get; set; }
        public int Quantity { get; set; }
    }
}