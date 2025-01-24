using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public interface ITableRepository
    {
        Task<List<Table>> GetAll();
        Task<Table> GetById(int id);
        Task<Table> Add(Table table);
        Task Update(Table table);
        Task Delete(int id);
        Task<List<Table>> GetAvailableTables();
    }
}