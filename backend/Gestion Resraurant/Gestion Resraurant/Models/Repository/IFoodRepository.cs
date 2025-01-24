using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public interface IFoodRepository
    {
        Task<List<Food>> GetAll();
        Task<Food> GetById(int id);
        Task<Food> GetByName(string name);
        Task<Food> Add(Food food);
        Task Update(Food food);
        Task Delete(int id);
    }
}