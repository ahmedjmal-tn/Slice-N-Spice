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
    public class ReservationController : ControllerBase
    {
        private readonly IReservation _reservationRepository;
        private readonly ITableRepository _tableRepository;

        public ReservationController(IReservation reservationRepository, ITableRepository tableRepository)
        {
            _reservationRepository = reservationRepository;
            _tableRepository = tableRepository;
        }

        // GET: api/reservation
        [HttpGet]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationRepository.GetAllReservations();
            var reservationsDto = reservations.Select(r => new ReservationDTO
            {
                Id = r.Id,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                TableId = r.TableId,
                UserId = r.UserId
            }).ToList();

            return Ok(reservationsDto);
        }

        // GET: api/reservation/table/{tableId}
        [HttpGet("table/{tableId}")]
        public async Task<IActionResult> GetReservationsByTableId(int tableId)
        {
            var reservations = await _reservationRepository.GetReservationsByTableId(tableId);
            if (reservations == null || !reservations.Any())
                return NotFound($"Aucune réservation trouvée pour la table avec l'ID {tableId}.");

            var reservationsDto = reservations.Select(r => new ReservationDTO
            {
                Id = r.Id,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                TableId = r.TableId,
                UserId = r.UserId
            }).ToList();

            return Ok(reservationsDto);
        }

        // GET: api/reservation/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetReservationsByUserId(string userId)
        {
            var reservations = await _reservationRepository.GetReservationsByUserId(userId);
            if (reservations == null || !reservations.Any())
                return NotFound($"Aucune réservation trouvée pour l'utilisateur avec l'ID {userId}.");

            var reservationsDto = reservations.Select(r => new ReservationDTO
            {
                Id = r.Id,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                TableId = r.TableId,
                UserId = r.UserId
            }).ToList();

            return Ok(reservationsDto);
        }

        // POST: api/reservation
        [HttpPost]
        public async Task<IActionResult> AddReservation([FromBody] ReservationDTO reservationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Vérifiez si la table existe
            var table = await _tableRepository.GetById(reservationDto.TableId);
            if (table == null)
                return NotFound($"Table avec l'ID {reservationDto.TableId} introuvable.");

            var reservation = new Reservation
            {
                StartTime = reservationDto.StartTime,
                EndTime = reservationDto.EndTime,
                TableId = reservationDto.TableId,
                UserId = reservationDto.UserId
            };

            try
            {
                var newReservation = await _reservationRepository.AddReservation(reservation);
                var newReservationDto = new ReservationDTO
                {
                    Id = newReservation.Id,
                    StartTime = newReservation.StartTime,
                    EndTime = newReservation.EndTime,
                    TableId = newReservation.TableId,
                    UserId = newReservation.UserId
                };
                return CreatedAtAction(nameof(GetReservationsByTableId), new { tableId = newReservationDto.TableId }, newReservationDto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/reservation/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            try
            {
                await _reservationRepository.CancelReservation(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de l'annulation de la réservation : {ex.Message}");
            }
        }
    }
}