using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Models.Repository
{
    public interface IReservation
    {
        Task<List<Reservation>> GetAllReservations();
        Task<List<Reservation>> GetReservationsByTableId(int tableId);
        Task<List<Reservation>> GetReservationsByUserId(string userId);
        Task<Reservation> AddReservation(Reservation reservation);
        Task CancelReservation(int reservationId);
        Task<bool> IsTableAvailable(int tableId, DateTime startTime, DateTime endTime);
    }
}