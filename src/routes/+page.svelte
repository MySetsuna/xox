<script>
  import { invoke } from '@tauri-apps/api/core';
  import Header from '../layouts/header.svelte';
  import Sider from '../layouts/sider.svelte';
  import NoteCreator from '../layouts/note-creator.svelte';
  import Notes from '../layouts/notes.svelte';

  let name = $state('');
  let greetMsg = $state('');

  // @ts-ignore
  async function greet(event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke('greet', { name });
  }
</script>

<main class="container">
  <div class="layout">
    <aside class="sider">
      <Sider />
    </aside>
    <section class="content">
      <Header />
      <NoteCreator />
      <Notes />
    </section>
  </div>
</main>

<style>
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    height: 100vh;
  }

  .sider {
    background-color: #e8e8e8;
    padding: 1em;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }

  .content {
    padding: 1em;
  }

  @media (prefers-color-scheme: dark) {
    .sider {
      background-color: #1f1f1f;
    }
  }
</style>
