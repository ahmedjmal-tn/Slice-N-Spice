using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Gestion_Resraurant.Models;
using Gestion_Resraurant.Models.DTO;
using Gestion_Resraurant.Models.Repository;
using System.Linq;
using Gestion_Resraurant.DTO.Reservation;
using Microsoft.AspNetCore.Authorization;

namespace Gestion_Resraurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TableController : ControllerBase
    {
        private readonly ITableRepository _tableRepository;
      

        public TableController(ITableRepository tableRepository)
        {
            _tableRepository = tableRepository;
          
        }

        // GET: api/table
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tables = await _tableRepository.GetAll();
            var tablesDto = tables.Select(t => new TableDTO
            {
                Id = t.Id,
                Number = t.Number,
                Capacity = t.Capacity,
                Availability = t.Availability
            }).ToList();
            return Ok(tablesDto);
        }

        // GET: api/table/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var table = await _tableRepository.GetById(id);
            if (table == null)
                return NotFound($"Table avec l'ID {id} introuvable.");

            var tableDto = new TableDTO
            {
                Id = table.Id,
                Number = table.Number,
                Capacity = table.Capacity,
                Availability = table.Availability
            };

            return Ok(tableDto);
        }

        // POST: api/table
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] TableDTO tableDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var table = new Table
            {
                Number = tableDto.Number,
                Capacity = tableDto.Capacity,
                Availability = tableDto.Availability
            };

            var newTable = await _tableRepository.Add(table);
            var newTableDto = new TableDTO
            {
                Id = newTable.Id,
                Number = newTable.Number,
                Capacity = newTable.Capacity,
                Availability = newTable.Availability
            };

            return CreatedAtAction(nameof(GetById), new { id = newTableDto.Id }, newTableDto);
        }

        // PUT: api/table/{id}
        [HttpPut("{id}")]

        public async Task<IActionResult> Update(int id, [FromBody] TableDTO tableDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingTable = await _tableRepository.GetById(id);
            if (existingTable == null)
                return NotFound($"Table avec l'ID {id} introuvable.");

            existingTable.Number = tableDto.Number;
            existingTable.Capacity = tableDto.Capacity;
            existingTable.Availability = tableDto.Availability;

            try
            {
                await _tableRepository.Update(existingTable);
                return Ok(tableDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de la mise à jour : {ex.Message}");
            }
        }

        // DELETE: api/table/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingTable = await _tableRepository.GetById(id);
            if (existingTable == null)
                return NotFound($"Table avec l'ID {id} introuvable.");

            await _tableRepository.Delete(id);
            return NoContent();
        }

        // GET: api/table/available
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableTables()
        {
            var tables = await _tableRepository.GetAvailableTables();
            if (tables == null || tables.Count == 0)
                return NotFound("Aucune table disponible pour le moment.");

            var tablesDto = tables.Select(t => new TableDTO
            {
                Id = t.Id,
                Number = t.Number,
                Capacity = t.Capacity,
                Availability = t.Availability
            }).ToList();

            return Ok(tablesDto);
        }

    }
}