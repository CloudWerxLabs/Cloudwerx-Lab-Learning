// Configure marked.js
const renderer = new marked.Renderer();

// Override heading rendering to ensure proper ID generation
renderer.heading = function(text, level) {
    const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')    // Remove special characters
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/-+/g, '-');        // Replace multiple hyphens with single hyphen
    
    return `<h${level} id="${id}">${text}</h${level}>`;
};

marked.setOptions({
    renderer: renderer,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// Document data structure
const docs = [
    { path: 'docs/welcome.md', title: 'Welcome' },
    
    // AI Section
    { path: 'docs/ai_workstation_guide.md', title: 'AI Workstation Guide', section: 'AI' },
    
    // Backend Section
    { path: 'docs/backend-guide.md', title: 'Backend Guide', section: 'Backend' },
    { path: 'docs/backend-learning-resources.md', title: 'Backend Learning Resources', section: 'Backend' },
    
    // CSS Section
    { path: 'docs/css-guide.md', title: 'CSS Guide', section: 'CSS' },
    { path: 'docs/css-learning-resources.md', title: 'CSS Learning Resources', section: 'CSS' },
    
    // Design Patterns Section
    { path: 'docs/design-patterns-guide.md', title: 'Design Patterns Guide', section: 'Design Patterns' },
    { path: 'docs/design-patterns-learning-resources.md', title: 'Design Patterns Learning Resources', section: 'Design Patterns' },
    
    // Docker Section
    { path: 'docs/docker-guide.md', title: 'Docker Guide', section: 'Docker' },
    { path: 'docs/docker-learning-resources.md', title: 'Docker Learning Resources', section: 'Docker' },
    
    // Documentation Section
    { path: 'docs/documentation-guide.md', title: 'Documentation Guide', section: 'Documentation' },
    
    // Frontend Section
    { path: 'docs/frontend-guide.md', title: 'Frontend Guide', section: 'Frontend' },
    { path: 'docs/frontend-learning-resources.md', title: 'Frontend Learning Resources', section: 'Frontend' },
    
    // Git Section
    { path: 'docs/git-guide.md', title: 'Git Guide', section: 'Git' },
    { path: 'docs/git-learning-resources.md', title: 'Git Learning Resources', section: 'Git' },
    
    // HTML Section
    { path: 'docs/html-guide.md', title: 'HTML Guide', section: 'HTML' },
    { path: 'docs/html-learning-resources.md', title: 'HTML Learning Resources', section: 'HTML' },
    
    // JavaScript Section
    { path: 'docs/javascript-complete-guide.md', title: 'JavaScript Complete Guide', section: 'JavaScript' },
    { path: 'docs/javascript-guide.md', title: 'JavaScript Guide', section: 'JavaScript' },
    { path: 'docs/javascript-learning-resources.md', title: 'JavaScript Learning Resources', section: 'JavaScript' },
    
    // Kubernetes Section
    { path: 'docs/kubernetes-guide.md', title: 'Kubernetes Guide', section: 'Kubernetes' },
    { path: 'docs/kubernetes-learning-resources.md', title: 'Kubernetes Learning Resources', section: 'Kubernetes' },
    
    // Learning Resources Section
    { path: 'docs/learning-resources.md', title: 'Learning Resources', section: 'Learning Resources' },
    
    // Linux Section
    { path: 'docs/linux-guide.md', title: 'Linux Guide', section: 'Linux' },
    
    // Next.js Section
    { path: 'docs/nextjs-guide.md', title: 'Next.js Guide', section: 'Next.js' },
    { path: 'docs/nextjs-learning-resources.md', title: 'Next.js Learning Resources', section: 'Next.js' },
    
    // React Section
    { path: 'docs/react-guide.md', title: 'React Guide', section: 'React' },
    { path: 'docs/react-learning-resources.md', title: 'React Learning Resources', section: 'React' },
    
    // Security Section
    { path: 'docs/security-guide.md', title: 'Security Guide', section: 'Security' },
    { path: 'docs/security-learning-resources.md', title: 'Security Learning Resources', section: 'Security' },
    
    // SVG Section
    { path: 'docs/svg-guide.md', title: 'SVG Guide', section: 'SVG' },
    { path: 'docs/svg-learning-resources.md', title: 'SVG Learning Resources', section: 'SVG' },
    
    // System Design Section
    { path: 'docs/system-design-guide.md', title: 'System Design Guide', section: 'System Design' },
    { path: 'docs/system-design-learning-resources.md', title: 'System Design Learning Resources', section: 'System Design' },
    
    // Testing Section
    { path: 'docs/testing-guide.md', title: 'Testing Guide', section: 'Testing' },
    { path: 'docs/testing-learning-resources.md', title: 'Testing Learning Resources', section: 'Testing' },
    { path: 'docs/testing-simple-guide.md', title: 'Simple Testing Guide', section: 'Testing' },
    { path: 'docs/testing-simple-learning-resources.md', title: 'Simple Testing Learning Resources', section: 'Testing' },
    
    // TypeScript Section
    { path: 'docs/typescript-complete-guide.md', title: 'TypeScript Complete Guide', section: 'TypeScript' },
    { path: 'docs/typescript-guide.md', title: 'TypeScript Guide', section: 'TypeScript' },
    { path: 'docs/typescript-learning-resources.md', title: 'TypeScript Learning Resources', section: 'TypeScript' },
    
    // VS Code Section
    { path: 'docs/vscode-guide.md', title: 'VS Code Guide', section: 'VS Code' },
    { path: 'docs/vscode-shortcuts.md', title: 'VS Code Shortcuts', section: 'VS Code' },
    
    // Windows Section
    { path: 'docs/windows-shortcuts.md', title: 'Windows Shortcuts', section: 'Windows' },
    
    // Windsurf Section
    { path: 'docs/windsurf-guide.md', title: 'Windsurf Guide', section: 'Windsurf' },
    { path: 'docs/windsurf-shortcuts.md', title: 'Windsurf Shortcuts', section: 'Windsurf' }
];

// Document cache and state management
let isLoadingDocument = false;
let currentDocIndex = -1;
let documentCache = new Map();
let isInitialized = false;

// DOM Elements
const docList = document.querySelector('.doc-list');
const contentTitle = document.getElementById('current-doc-title');
const markdownContent = document.querySelector('.markdown-content');
const searchInput = document.getElementById('search');
const prevButton = document.querySelector('.prev-doc');
const nextButton = document.querySelector('.next-doc');

// Update navigation buttons
function updateNavButtons() {
    prevButton.disabled = currentDocIndex <= 0;
    nextButton.disabled = currentDocIndex >= docs.length - 1;
}

// Navigation event handlers
prevButton.addEventListener('click', () => {
    if (currentDocIndex > 0) {
        loadDocument(docs[currentDocIndex - 1].path);
    }
});

nextButton.addEventListener('click', () => {
    if (currentDocIndex < docs.length - 1) {
        loadDocument(docs[currentDocIndex + 1].path);
    }
});

// Load and render a document
async function loadDocument(path) {
    if (isLoadingDocument) return;
    
    try {
        isLoadingDocument = true;
        
        // If this is the same document that's currently loaded, don't reload
        if (currentDocIndex !== -1 && docs[currentDocIndex].path === path) {
            isLoadingDocument = false;
            return;
        }

        let markdown;
        if (documentCache.has(path)) {
            markdown = documentCache.get(path);
        } else {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Failed to load document');
            markdown = await response.text();
            documentCache.set(path, markdown);
        }

        // Update current document index
        currentDocIndex = docs.findIndex(doc => doc.path === path);
        
        // Update content
        contentTitle.textContent = docs[currentDocIndex].title;
        markdownContent.innerHTML = marked.parse(markdown);

        // Add click handlers for all anchor links
        const links = markdownContent.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without scrolling
                    history.pushState(null, null, link.getAttribute('href'));
                }
            });
        });
        
        // Handle initial hash in URL
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
        
        // Update navigation
        updateNavButtons();
        
        // Update URL without triggering a page reload
        const url = new URL(window.location);
        url.searchParams.set('doc', path);
        window.history.pushState({}, '', url);

    } catch (error) {
        console.error('Error loading document:', error);
        markdownContent.innerHTML = '<p>Error loading document</p>';
    } finally {
        isLoadingDocument = false;
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize once
    if (!isInitialized) {
        // Clear any existing intervals that might be running
        const highestId = window.setInterval(() => {}, 0);
        for (let i = 0; i <= highestId; i++) {
            window.clearInterval(i);
        }
        
        initializeDocList();
        initializeSearch();
        initializeMobileSidebar();
        initializeTheme();
        
        // Load welcome message by default
        loadDocument('docs/welcome.md');
        
        isInitialized = true;
    }
});

// Prevent any automatic refresh/reload behaviors
window.onbeforeunload = () => {
    return; // This will prevent some types of automatic reloads
};

// Clear any existing intervals when the page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const highestId = window.setInterval(() => {}, 0);
        for (let i = 0; i <= highestId; i++) {
            window.clearInterval(i);
        }
    }
});

// Initialize the document list
function initializeDocList() {
    docList.innerHTML = '';
    
    // Group documents by section
    const sections = new Map();
    docs.forEach(doc => {
        const section = doc.section || 'General';
        if (!sections.has(section)) {
            sections.set(section, []);
        }
        sections.get(section).push(doc);
    });
    
    // Create section groups
    sections.forEach((sectionDocs, sectionName) => {
        // Create section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.textContent = sectionName;
        docList.appendChild(sectionHeader);
        
        // Create section links
        sectionDocs.forEach(doc => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = doc.title;
            link.setAttribute('data-path', doc.path);
            
            // Debounced click handler
            let clickTimeout;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Clear any pending click
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                }
                
                // Debounce the click
                clickTimeout = setTimeout(() => {
                    // Remove active class from all links and add to clicked one
                    document.querySelectorAll('.doc-list a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Load the document
                    loadDocument(doc.path);
                }, 100);
            });
            docList.appendChild(link);
        });
    });
}

// Search functionality
function initializeSearch() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.doc-list a').forEach(link => {
            const title = link.textContent.toLowerCase();
            const path = link.getAttribute('data-path').toLowerCase();
            
            if (title.includes(searchTerm) || path.includes(searchTerm)) {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
    });
}

// Mobile sidebar toggle
function initializeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    content.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
}

// Theme switching
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const highlightTheme = document.getElementById('highlight-theme');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateHighlightTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateHighlightTheme(newTheme);
    });
}

function updateHighlightTheme(theme) {
    const highlightTheme = document.getElementById('highlight-theme');
    const darkTheme = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css';
    const lightTheme = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-light.min.css';
    
    highlightTheme.href = theme === 'dark' ? darkTheme : lightTheme;
}
