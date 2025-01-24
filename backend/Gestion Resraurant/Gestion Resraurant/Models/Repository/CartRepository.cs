using Gestion_Resraurant.Models.Repository;
using Gestion_Resraurant.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CartRepository : ICartRepository
{
    private readonly RestoContext _context;

    public CartRepository(RestoContext context)
    {
        _context = context;
    }

    public async Task<Cart> GetByIdAsync(int id)
    {
        return await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Food) // Inclure les articles de nourriture associés
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Cart>> GetAllAsync()
    {
        return await _context.Carts.Include(c => c.CartItems).ToListAsync();
    }

    public async Task AddAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
        await _context.SaveChangesAsync(); // Assurez-vous que SaveChangesAsync est appelé
    }

    public void Update(Cart cart)
    {
        _context.Carts.Update(cart);
        _context.SaveChangesAsync(); // Assurez-vous que SaveChangesAsync est appelé
    }

    public void Delete(Cart cart)
    {
        _context.Carts.Remove(cart);
        _context.SaveChangesAsync(); // Assurez-vous que SaveChangesAsync est appelé
    }

    public async Task<Cart> GetByUserIdAsync(string userId)
    {
        return await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Food) // Inclure les articles de nourriture associés
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }
}