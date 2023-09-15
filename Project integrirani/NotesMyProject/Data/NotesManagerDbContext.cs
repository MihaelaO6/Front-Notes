using Microsoft.EntityFrameworkCore;
using NotesMyProject.Models.Entities;

namespace NotesMyProject.Data
{
    public class NotesManagerDbContext : DbContext
    {
        public NotesManagerDbContext(DbContextOptions options) : base(options)
        {
        }

        // type of our property is Note type
        // name of table/property is Notes
        // this is interface for using Note table
        public DbSet<Note> Notes { get; set; }
    }
}
