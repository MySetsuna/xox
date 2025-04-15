<script>
    // 多种展示类型
    // mode: 'grid', // 0 :grid 默认, 1: date-groups 日期分组 , 2:tag-groups 标签分组 3: schedule
    export let notes = [];

    // Function to toggle pinning a note
    function togglePin(note) {
        note.pinned = !note.pinned;
    }

    // Separate pinned and unpinned notes
    $: pinnedNotes = notes.filter(note => note.pinned);
    $: unpinnedNotes = notes.filter(note => !note.pinned);
</script>

<style>
    .pinned-section, .unpinned-section {
        margin-bottom: 2rem;
    }
    .note {
        border: 1px solid #ccc;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 5px;
    }
    .pinned {
        background-color: #f9f9f9;
    }
    .pin-button {
        cursor: pointer;
        color: #007bff;
        border: none;
        background: none;
        font-size: 0.9rem;
    }
</style>

<div class="pinned-section">
    <h2>Pinned Notes</h2>
    {#if pinnedNotes.length > 0}
        {#each pinnedNotes as note}
            <div class="note pinned">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button class="pin-button" on:click={() => togglePin(note)}>
                    Unpin
                </button>
            </div>
        {/each}
    {:else}
        <p>No pinned notes.</p>
    {/if}
</div>

<div class="unpinned-section">
    <h2>Other Notes</h2>
    {#if unpinnedNotes.length > 0}
        {#each unpinnedNotes as note}
            <div class="note">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button class="pin-button" on:click={() => togglePin(note)}>
                    Pin
                </button>
            </div>
        {/each}
    {:else}
        <p>No notes available.</p>
    {/if}
</div>