<script>
    let notebookName = '';

    function createNotebook() {
        if (notebookName.trim()) {
            alert(`Notebook "${notebookName}" created!`);
            notebookName = '';
        } else {
            alert('Please enter a notebook name.');
        }
    }
</script>

<header class="app-header">
    <h1>Notebook App</h1>
    <div class="notebook-creator">
        <input
            type="text"
            placeholder="Enter notebook name"
            bind:value={notebookName}
        />
        <button on:click={createNotebook}>Create Notebook</button>
    </div>
</header>

<style>
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #6200ea;
        color: white;
    }

    .notebook-creator {
        display: flex;
        gap: 0.5rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #03dac6;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #018786;
    }
</style>