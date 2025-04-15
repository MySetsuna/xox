<script>
  import { onMount } from 'svelte';
  let noteType = 'text'; // Default note type
  let noteContent = '';
  /**
   * @type {null}
   */
  let imageFile = null;
  /**
   * @type {null}
   */
  let audioFile = null;

  /**
   * @param {{ target: { value: string; }; }} event
   */
  function handleNoteTypeChange(event) {
    noteType = event.target.value;
    noteContent = '';
    imageFile = null;
    audioFile = null;
  }

  /**
   * @param {{ target: { files: any[]; }; }} event
   */
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (noteType === 'image') {
      imageFile = file;
    } else if (noteType === 'audio') {
      audioFile = file;
    }
  }

  function saveNote() {
    const note = {
      type: noteType,
      content: noteContent,
      image: imageFile,
      audio: audioFile,
    };
    console.log('Note saved:', note);
    // Add logic to save the note
  }
</script>

<div class="note-creator">
  <h2>Create a Note</h2>
  <label for="note-type">Select Note Type:</label>
  <select id="note-type" bind:value={noteType} on:change={handleNoteTypeChange}>
    <option value="text">Text</option>
    <option value="code">Code</option>
    <option value="image">Image</option>
    <option value="drawing">Drawing</option>
    <option value="audio">Audio</option>
  </select>

  {#if noteType === 'text' || noteType === 'code'}
    <textarea
      placeholder={noteType === 'text'
        ? 'Write your note here...'
        : 'Write your code here...'}
      bind:value={noteContent}
    ></textarea>
  {/if}

  {#if noteType === 'image' || noteType === 'audio'}
    <input
      type="file"
      accept={noteType === 'image' ? 'image/*' : 'audio/*'}
      on:change={handleFileUpload}
    />
  {/if}

  {#if noteType === 'drawing'}
    <p>Drawing feature coming soon...</p>
  {/if}

  <button on:click={saveNote}>Save Note</button>
</div>

<style>
  .note-creator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin: auto;
  }

  textarea {
    width: 100%;
    height: 150px;
    resize: none;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
