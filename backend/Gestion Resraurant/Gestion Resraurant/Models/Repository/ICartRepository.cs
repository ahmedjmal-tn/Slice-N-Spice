using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public interface ICartRepository
    {
        Task<Cart> GetByIdAsync(int id);
        Task<IEnumerable<Cart>> GetAllAsync();
        Task AddAsync(Cart cart);
        void Update(Cart cart);
        void Delete(Cart cart);
        Task<Cart> GetByUserIdAsync(string userId); // Nouvelle méthode
    }
}