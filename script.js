// get the save button
const saveBtn = document.querySelector("#btnSave");
const createBtn = document.querySelector("#btnCreate");

const titleInput = document.querySelector("#title");
const descInput = document.querySelector("#description");

const notesContainer = document.querySelector("#notes-container");

const deleteBtn = document.querySelector("#btnDelete");

 
// clear the form after adding note
function clearForm(){
    titleInput.value = '';
    descInput.value = '';

    deleteBtn.classList.add('hidden');
    saveBtn.classList.add('hidden');

  //  console.log("vo clear form sme posle update ili add")
}

function displayNotesInForm(note){ // display the note that is clicked in the form
    titleInput.value = note.title;
    descInput.value = note.description;
    deleteBtn.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    deleteBtn.setAttribute('data-id', note.id);
    saveBtn.setAttribute('data-id', note.id);

}

function getNoteById(id){
    fetch(`https://localhost:7226/api/Notes/${id}`)
    .then(data => data.json())
    .then(response => {
        displayNotesInForm(response);
    });
  //  console.log("vo get note by id sme");
}

function populateForm(id){// title, description){
   // titleInput.value = title;
   // descInput.value = description;
   getNoteById(id);   // talk to api and gets notes by id 
}

function addNote(title, description){ //gets from form 
    const body = {
        title: title,
        description: description,
        isVisible: true
    };
    //save:
    fetch('https://localhost:7226/api/Notes', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        } 
    }).then(data => data.json())   // converting data to json
    .then(response => {
       // console.log(response);
        clearForm();
        getAllNotes();
    });
 }

// iterate in array and show all notes
function displayNotes(notes){
    let allNotes = '';
    //console.log("vlaga u display all notes");
    notes.forEach(note => {
        const noteElement =  `  
                                <div class="note" data-id="${note.id}">
                                    <h3>${note.title}</h3> 
                                    <p>${note.description}</p>
                                </div>
                                `;
        allNotes += noteElement;
    });
    notesContainer.innerHTML = allNotes;

    // add event listeners
    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('click', function(){
            //alert();
           // alert(note.dataset.id);
            populateForm(note.dataset.id)
        })
    });
}


// get notes
function getAllNotes(){
    fetch('https://localhost:7226/api/Notes')
    .then(data => data.json())
    .then(response => {
        console.log(response);
        displayNotes(response);
    });
}

// cal get function
getAllNotes();

// updating note:
function updateNote(id, title, description){
    const body = {
        title: title,
        description: description,
        isVisible: true
    };
    //save:
    fetch(`https://localhost:7226/api/Notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then(data => data.json())  // converting data to json
    .then(response => {
    //    console.log(response);
        clearForm();
        getAllNotes();
    });
}
// deleting the note
function deleteNote(id){
    fetch(`https://localhost:7226/api/Notes/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })//.then(data => data.json())
    .then(response => {
        //console.log(response);
        clearForm();  // to delete from page
        getAllNotes();
    });
}

createBtn.addEventListener('click', function(){
    if(titleInput.value != "")
    {
        addNote(titleInput.value,descInput.value);
    }
    else{
        alert("empty title");
    }

})

// create event listener
saveBtn.addEventListener('click', function(){

    let id = saveBtn.dataset.id;

    if(id){
        let updateID = id;
  //      id = '';
        updateNote(updateID, titleInput.value, descInput.value);
    }
    /*else{
        addNote(titleInput.value,descInput.value);
        console.log("new dodadeno vo save event");
    }*/
})


// add event listener for delete button
deleteBtn.addEventListener('click', function(){
    const id = deleteBtn.dataset.id;
    deleteNote(id);

});

notesContainer.addEventListener('click', function(){
    clearForm();
    getAllNotes();
});