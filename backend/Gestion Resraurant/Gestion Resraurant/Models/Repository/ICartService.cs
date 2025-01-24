using System.Collections.Generic;
using System.Threading.Tasks;
using Gestion_Resraurant.DTO.Cart;
using Gestion_Resraurant.Models.DTO;

namespace Gestion_Resraurant.Models.Services
{
    public interface ICartService
    {
        Task<CartDTO> GetCartByIdAsync(int id);
        Task<IEnumerable<CartDTO>> GetAllCartsAsync();
        Task AddCartAsync(CartDTO cartDto);
        Task UpdateCartAsync(CartDTO cartDto);
        Task DeleteCartAsync(int id);
        Task<CartDTO> GetCartByUserIdAsync(string userId);
        Task UpdateCartItemQuantityAsync(int cartItemId, int quantity); // New method
        Task DeleteCartItemAsync(int cartItemId); // New method
        Task AddFoodToCartAsync(int cartId, int foodId, int quantity);
    }
}