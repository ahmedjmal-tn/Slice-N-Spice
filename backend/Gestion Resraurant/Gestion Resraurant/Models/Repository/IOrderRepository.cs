using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public interface IOrderRepository
    {
        Task<Order> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task AddAsync(Order order);
        void Update(Order order);
        void Delete(Order order);
        Task<IEnumerable<Order>> GetByUserIdAsync(string userId);
    }
}