using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public class CartItemRepository : ICartItemRepository
    {
        private readonly RestoContext _context;

        public CartItemRepository(RestoContext context)
        {
            _context = context;
        }

        public async Task<CartItem> GetByIdAsync(int id)
        {
            return await _context.CartItems.FindAsync(id);
        }

        public async Task<IEnumerable<CartItem>> GetAllAsync()
        {
            return await _context.CartItems.ToListAsync();
        }

        public async Task AddAsync(CartItem cartItem)
        {
            await _context.CartItems.AddAsync(cartItem);
            await _context.SaveChangesAsync();
        }

        public void Update(CartItem cartItem)
        {
            _context.CartItems.Update(cartItem);
            _context.SaveChangesAsync();
        }

        public void Delete(CartItem cartItem)
        {
            _context.CartItems.Remove(cartItem);
            _context.SaveChangesAsync();
        }

        public async Task UpdateQuantityAsync(int cartItemId, int quantity)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem != null)
            {
                cartItem.Quantite = quantity;
                _context.CartItems.Update(cartItem);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteByCartIdAsync( int cartItemId)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.Id == cartItemId);
            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
            }
        }
    }
}