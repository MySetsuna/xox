<script>
  import { onMount } from 'svelte';

  let searchQuery = '';
  let userMenuOpen = false;

  const refreshPage = () => {
    location.reload();
  };

  const toggleUserMenu = () => {
    userMenuOpen = !userMenuOpen;
  };

  const changeLayoutMode = () => {
    // Logic to toggle layout mode (e.g., light/dark mode)
    document.body.classList.toggle('dark-mode');
  };

  const openSettings = () => {
    // Logic to open system settings
    alert('Open system settings');
  };
</script>

<header>
  <button on:click={openSettings} title="System Settings">⚙️</button>
  <div class="search-bar">
    <input type="text" placeholder="Search notes..." bind:value={searchQuery} />
  </div>
  <div class="actions">
    <button on:click={refreshPage} title="Refresh">🔄</button>
    <button on:click={changeLayoutMode} title="Change Layout Mode">🌓</button>
    <a
      class="user-avatar"
      on:click={toggleUserMenu}
      aria-expanded={userMenuOpen}
      aria-haspopup="true"
    >
      <img src="/path/to/avatar.jpg" alt="User Avatar" width="32" height="32" />
      <div class="user-menu {userMenuOpen ? 'open' : ''}">
        <p>User Info</p>
        <button on:click={() => alert('Open user settings')}
          >User Settings</button
        >
      </div>
    </a>
  </div>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: var(--header-bg, #f8f9fa);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .search-bar {
    flex-grow: 1;
    max-width: 600px;
    margin: 0 1rem;
  }

  .search-bar input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-avatar {
    position: relative;
    cursor: pointer;
  }

  .user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    display: none;
  }

  .user-menu.open {
    display: block;
  }
</style>
