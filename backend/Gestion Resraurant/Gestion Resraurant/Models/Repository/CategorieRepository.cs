using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public class CategorieRepository : ICategorieRepository
    {
        private readonly RestoContext context;

        public CategorieRepository(RestoContext context)
        {
            this.context = context;
        }

        public async Task<Categorie> Add(Categorie categorie)
        {
            categorie.Id = 0;
            var result = await context.Categories.AddAsync(categorie);
            await context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task Delete(int id)
        {
            var categorie = await context.Categories.FindAsync(id);
            if (categorie != null)
            {
                context.Categories.Remove(categorie);
                await context.SaveChangesAsync();
            }
        }

        public async Task<List<Categorie>> GetAll()
        {
            return await context.Categories.ToListAsync();
        }

        public async Task<Categorie> GetById(int id)
        {
            return await context.Categories.FindAsync(id);
        }

        public async Task<Categorie> GetByName(string name)
        {
            return await context.Categories.FirstOrDefaultAsync(c => c.Name == name);
        }

        public async Task Update(Categorie categorie)
        {
            context.Categories.Update(categorie);
            await context.SaveChangesAsync();
        }

        public async Task<Categorie> GetByIdWithFoods(int id)
        {
            return await context.Categories.Include(c => c.Foods).FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}