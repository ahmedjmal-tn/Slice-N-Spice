using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public class FoodRepository : IFoodRepository
    {
        private readonly RestoContext context;

        public FoodRepository(RestoContext context)
        {
            this.context = context;
        }

        public async Task<Food> Add(Food food)
        {
            food.Id = 0;
            var result = await context.Foods.AddAsync(food);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task Delete(int id)
        {
            var food = await context.Foods.FindAsync(id);
            if (food != null)
            {
                context.Foods.Remove(food);
                await context.SaveChangesAsync();
            }
        }

        public async Task<List<Food>> GetAll()
        {
            return await context.Foods.ToListAsync();
        }

        public async Task<Food> GetById(int id)
        {
            return await context.Foods.FindAsync(id);
        }

        public async Task<Food> GetByName(string name)
        {
            return await context.Foods.FirstOrDefaultAsync(f => f.Name == name);
        }

        public async Task Update(Food food)
        {
            context.Foods.Update(food);
            await context.SaveChangesAsync();
        }
    }
}