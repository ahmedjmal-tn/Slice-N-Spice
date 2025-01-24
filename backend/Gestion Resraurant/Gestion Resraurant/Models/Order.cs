using System.ComponentModel.DataAnnotations;

namespace Gestion_Resraurant.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime DateCreation { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        // New Status property added
        [Required]
        public OrderStatus Status { get; set; } // Pending or Delivered

        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }

    // Enum for Payment Methods
    public enum PaymentMethod
    {
        Domicile,
        CarteBancaire
    }

    // Enum for Order Status
    public enum OrderStatus
    {
        Pending,      // Order is yet to be processed
        Delivered     // Order has been delivered
    }
}
