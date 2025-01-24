using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public class ReservationRepository : IReservation
    {
        private readonly RestoContext _context;

        public ReservationRepository(RestoContext context)
        {
            _context = context;
        }

        public async Task<List<Reservation>> GetAllReservations()
        {
            return await _context.Reservations.ToListAsync();
        }

        public async Task<List<Reservation>> GetReservationsByTableId(int tableId)
        {
            return await _context.Reservations
                .Where(r => r.TableId == tableId)
                .ToListAsync();
        }

        public async Task<List<Reservation>> GetReservationsByUserId(string userId)
        {
            return await _context.Reservations
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> IsTableAvailable(int tableId, DateTime startTime, DateTime endTime)
        {
            var conflictingReservations = await _context.Reservations
                .Where(r => r.TableId == tableId &&
                            ((r.StartTime < endTime && r.StartTime >= startTime) ||
                             (r.EndTime > startTime && r.EndTime <= endTime) ||
                             (r.StartTime <= startTime && r.EndTime >= endTime)))
                .ToListAsync();

            return !conflictingReservations.Any();
        }

        public async Task<Reservation> AddReservation(Reservation reservation)
        {
            if (await IsTableAvailable(reservation.TableId, reservation.StartTime, reservation.EndTime))
            {
                var result = await _context.Reservations.AddAsync(reservation);
                await _context.SaveChangesAsync();
                return result.Entity;
            }
            else
            {
                throw new InvalidOperationException("The table is not available for the selected time period.");
            }
        }

        public async Task CancelReservation(int reservationId)
        {
            var reservation = await _context.Reservations.FindAsync(reservationId);
            if (reservation != null)
            {
                _context.Reservations.Remove(reservation);
                await _context.SaveChangesAsync();
            }
        }
    }
}