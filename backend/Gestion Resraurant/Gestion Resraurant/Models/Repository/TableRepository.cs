using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public class TableRepository : ITableRepository
    {
        private readonly RestoContext _context;

        public TableRepository(RestoContext context)
        {
            _context = context;
        }

        public async Task<List<Table>> GetAll()
        {
            return await _context.Tables.ToListAsync();
        }

        public async Task<Table> GetById(int id)
        {
            return await _context.Tables.FindAsync(id);
        }

        public async Task<Table> Add(Table table)
        {
            table.Id = 0;
            var result = await _context.Tables.AddAsync(table);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task Update(Table table)
        {
            _context.Tables.Update(table);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table != null)
            {
                _context.Tables.Remove(table);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Table>> GetAvailableTables()
        {
            return await _context.Tables
                .Where(t => t.Availability)
                .ToListAsync();
        }
    }
}