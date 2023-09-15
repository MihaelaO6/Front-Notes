using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesMyProject.Data;
using NotesMyProject.Models.Entities;
using System.Security.Permissions;

namespace NotesMyProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : Controller
    {
        // local private property
        private readonly NotesManagerDbContext notesDbContext;
        // constructor injection
        public NotesController(NotesManagerDbContext notesDbContext)
        {
            this.notesDbContext = notesDbContext;
        }

        // this method gets all notes
        [HttpGet]
        public async Task<IActionResult> GetAllNotes()
        {
            // get the notes from db 
            return Ok(await notesDbContext.Notes.ToListAsync());
        }

        // this method gets single note
        [HttpGet]
        [Route("{id:Guid}")]  // get id of note
        [ActionName("GetNote")]
        public async Task<IActionResult> GetNote(Guid id)
        {
            // get the notes from db 
            var note = await notesDbContext.Notes.FirstOrDefaultAsync(x => x.Id == id); // find the id in database
            // or
           // await notesDbContext.Notes.FindAsync(id);
           if(note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        // posting the notes
        [HttpPost]
  //      [Route("{id:Guid}")]  // get id of note
  //      [ActionName("GetNote")]
        public async Task<IActionResult> PostNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await notesDbContext.Notes.AddAsync(note);
            await notesDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
        }

        [HttpPut]
        [Route("{id:Guid}")]  //update note with this id
        public async Task<IActionResult> UpdateNote(Guid id, [FromBody] Note updatedNote)
        {
            var existingNote = await notesDbContext.Notes.FirstOrDefaultAsync(x => x.Id == id); // find the id in database
       
            if(existingNote == null)
            {
                return NotFound();
            }

            existingNote.Title = updatedNote.Title;
            existingNote.Description = updatedNote.Description;
            existingNote.IsVisible = updatedNote.IsVisible;

            await notesDbContext.SaveChangesAsync();

            return Ok(existingNote);
        }

        [HttpDelete]
        [Route("{id:Guid}")]  //delete note with this id
        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);

            if (existingNote == null)
            {
                return NotFound();
            }

            notesDbContext.Notes.Remove(existingNote);
            await notesDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
