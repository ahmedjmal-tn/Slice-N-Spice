using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly RestoContext _context;

        public OrderRepository(RestoContext context)
        {
            _context = context;
        }

        public async Task<Order> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Food)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders.Include(o => o.OrderItems).ToListAsync();
        }

        public async Task AddAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public void Update(Order order)
        {
            _context.Orders.Update(order);
            _context.SaveChangesAsync();
        }

        public void Delete(Order order)
        {
            _context.Orders.Remove(order);
            _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetByUserIdAsync(string userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Food)
                .Where(o => o.UserId == userId)
                .ToListAsync();
        }
    }
}