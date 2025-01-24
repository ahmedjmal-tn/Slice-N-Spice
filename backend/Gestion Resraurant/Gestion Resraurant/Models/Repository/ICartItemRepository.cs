namespace Gestion_Resraurant.Models.Repository
{
    public interface ICartItemRepository
    {
        Task<CartItem> GetByIdAsync(int id);
        Task<IEnumerable<CartItem>> GetAllAsync();
        Task AddAsync(CartItem cartItem);
        void Update(CartItem cartItem);
        void Delete(CartItem cartItem);
        Task UpdateQuantityAsync(int cartItemId, int quantity); // New method
        Task DeleteByCartIdAsync(int cartItemId); // New method
    }
}
