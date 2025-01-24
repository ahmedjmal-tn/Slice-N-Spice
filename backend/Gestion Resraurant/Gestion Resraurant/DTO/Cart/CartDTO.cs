using Gestion_Resraurant.Models.DTO;

namespace Gestion_Resraurant.DTO.Cart
{
    public class CartDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime DateCreation { get; set; }
        public List<CartItemDTO> CartItems { get; set; }
    }
}
