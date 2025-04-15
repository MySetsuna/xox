<script>
    import { onMount } from "svelte";

    let isCollapsed = false;
    let windowWidth = 0;

    const toggleMenu = () => {
        isCollapsed = !isCollapsed;
    };

    const updateWindowWidth = () => {
        windowWidth = window.innerWidth;
        if (windowWidth < 768) {
            isCollapsed = true;
        } else {
            isCollapsed = false;
        }
    };

    onMount(() => {
        updateWindowWidth();
        window.addEventListener("resize", updateWindowWidth);
        return () => window.removeEventListener("resize", updateWindowWidth);
    });
</script>

<style>
    .sider {
        width: var(--sider-width, 250px);
        transition: width 0.3s;
        background-color: #333;
        color: white;
        height: 100vh;
        overflow: hidden;
    }

    .sider.collapsed {
        --sider-width: 60px;
    }

    .menu-button {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin: 10px;
    }

    .menu-items {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .menu-item {
        padding: 10px 20px;
        cursor: pointer;
        white-space: nowrap;
    }

    .menu-item:hover {
        background-color: #444;
    }

    .collapsed .menu-item-text {
        display: none;
    }
</style>

<div class="sider {isCollapsed ? 'collapsed' : ''}">
    <button class="menu-button" on:click={toggleMenu}>
        {isCollapsed ? "☰" : "✖"}
    </button>
    <ul class="menu-items">
        <li class="menu-item">
            <span class="menu-item-text">Home</span>
        </li>
        <li class="menu-item">
            <span class="menu-item-text">About</span>
        </li>
        <li class="menu-item">
            <span class="menu-item-text">Contact</span>
        </li>
    </ul>
</div>