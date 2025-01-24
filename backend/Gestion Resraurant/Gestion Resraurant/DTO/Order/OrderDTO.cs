using Gestion_Resraurant.Models;

namespace Gestion_Resraurant.DTO.Order
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime DateCreation { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending; // Ajout de la propriété Status

        // Méthode pour changer le statut à Delivered
        public void MarkAsDelivered()
        {
            Status = OrderStatus.Delivered;
        }
    }
}
