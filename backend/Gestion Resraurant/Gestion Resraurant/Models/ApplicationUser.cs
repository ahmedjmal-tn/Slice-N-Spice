using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string Nom { get; set; }
    public string Prenom { get; set; }
}
