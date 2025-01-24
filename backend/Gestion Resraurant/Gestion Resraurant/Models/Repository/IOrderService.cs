using System.Collections.Generic;
using System.Threading.Tasks;
using Gestion_Resraurant.DTO.Order;

namespace Gestion_Resraurant.Models.Services
{
    public interface IOrderService
    {
        Task<OrderDTO> GetOrderByIdAsync(int id);
        Task<IEnumerable<OrderDTO>> GetAllOrdersAsync();
        Task AddOrderAsync(OrderDTO orderDto);
        Task UpdateOrderAsync(OrderDTO orderDto);
        Task DeleteOrderAsync(int id);
        Task<IEnumerable<OrderDTO>> GetOrdersByUserIdAsync(string userId);
        Task MarkOrderAsDeliveredAsync(int id); // Nouvelle méthode
    }
}