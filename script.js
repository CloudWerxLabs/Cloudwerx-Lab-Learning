// Configure marked.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

// Document data structure
const docs = [
    { path: 'docs/backend-guide.md', title: 'Backend Guide' },
    { path: 'docs/backend-learning-resources.md', title: 'Backend Learning Resources' },
    { path: 'docs/css-guide.md', title: 'CSS Guide' },
    { path: 'docs/css-learning-resources.md', title: 'CSS Learning Resources' },
    { path: 'docs/design-patterns-guide.md', title: 'Design Patterns Guide' },
    { path: 'docs/design-patterns-learning-resources.md', title: 'Design Patterns Learning Resources' },
    { path: 'docs/docker-guide.md', title: 'Docker Guide' },
    { path: 'docs/docker-learning-resources.md', title: 'Docker Learning Resources' },
    { path: 'docs/documentation-guide.md', title: 'Documentation Guide' },
    { path: 'docs/frontend-guide.md', title: 'Frontend Guide' },
    { path: 'docs/frontend-learning-resources.md', title: 'Frontend Learning Resources' },
    { path: 'docs/git-guide.md', title: 'Git Guide' },
    { path: 'docs/git-learning-resources.md', title: 'Git Learning Resources' },
    { path: 'docs/html-guide.md', title: 'HTML Guide' },
    { path: 'docs/html-learning-resources.md', title: 'HTML Learning Resources' },
    { path: 'docs/javascript-complete-guide.md', title: 'JavaScript Complete Guide' },
    { path: 'docs/javascript-guide.md', title: 'JavaScript Guide' },
    { path: 'docs/javascript-learning-resources.md', title: 'JavaScript Learning Resources' },
    { path: 'docs/kubernetes-guide.md', title: 'Kubernetes Guide' },
    { path: 'docs/kubernetes-learning-resources.md', title: 'Kubernetes Learning Resources' },
    { path: 'docs/learning-resources.md', title: 'Learning Resources' },
    { path: 'docs/linux-guide.md', title: 'Linux Guide' },
    { path: 'docs/nextjs-guide.md', title: 'Next.js Guide' },
    { path: 'docs/nextjs-learning-resources.md', title: 'Next.js Learning Resources' },
    { path: 'docs/react-guide.md', title: 'React Guide' },
    { path: 'docs/react-learning-resources.md', title: 'React Learning Resources' },
    { path: 'docs/security-guide.md', title: 'Security Guide' },
    { path: 'docs/security-learning-resources.md', title: 'Security Learning Resources' },
    { path: 'docs/svg-guide.md', title: 'SVG Guide' },
    { path: 'docs/svg-learning-resources.md', title: 'SVG Learning Resources' },
    { path: 'docs/system-design-guide.md', title: 'System Design Guide' },
    { path: 'docs/system-design-learning-resources.md', title: 'System Design Learning Resources' },
    { path: 'docs/testing-guide.md', title: 'Testing Guide' },
    { path: 'docs/testing-learning-resources.md', title: 'Testing Learning Resources' },
    { path: 'docs/typescript-complete-guide.md', title: 'TypeScript Complete Guide' },
    { path: 'docs/typescript-guide.md', title: 'TypeScript Guide' },
    { path: 'docs/typescript-learning-resources.md', title: 'TypeScript Learning Resources' },
    { path: 'docs/vscode-guide.md', title: 'VS Code Guide' },
    { path: 'docs/vscode-shortcuts.md', title: 'VS Code Shortcuts' },
    { path: 'docs/windows-shortcuts.md', title: 'Windows Shortcuts' },
    { path: 'docs/windsurf-guide.md', title: 'Windsurf Guide' },
    { path: 'docs/windsurf-shortcuts.md', title: 'Windsurf Shortcuts' }
];

// DOM Elements
const docList = document.querySelector('.doc-list');
const contentTitle = document.getElementById('current-doc-title');
const markdownContent = document.querySelector('.markdown-content');
const searchInput = document.getElementById('search');

// Initialize the document list
function initializeDocList() {
    const categories = {};
    
    // Group documents by category
    docs.forEach(doc => {
        const category = doc.path.split('/')[1].split('-')[0];
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(doc);
    });

    // Create and append document links
    Object.entries(categories).forEach(([category, categoryDocs]) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
        
        const docLinks = document.createElement('div');
        docLinks.className = 'category-docs';
        
        categoryDocs.forEach(doc => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = doc.title;
            link.setAttribute('data-path', doc.path);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links and add to clicked one
                document.querySelectorAll('.doc-list a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                
                // Load the document
                loadDocument(doc.path);
            });
            docLinks.appendChild(link);
        });
        
        categoryElement.appendChild(docLinks);
        docList.appendChild(categoryElement);
    });
}

// Load and render a document
async function loadDocument(path) {
    try {
        // Start fade out
        markdownContent.classList.add('loading');
        
        // Short delay for animation
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const response = await fetch(path);
        if (!response.ok) throw new Error('Failed to load document');
        
        const markdown = await response.text();
        
        // Reset scroll position
        const contentContainer = document.querySelector('.content');
        if (contentContainer) {
            contentContainer.scrollTop = 0;
        }
        
        // Update content
        markdownContent.innerHTML = marked.parse(markdown);
        
        // Update title
        const doc = docs.find(d => d.path === path);
        contentTitle.textContent = doc.title;
        
        // Highlight code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
        
        // Remove loading class to trigger fade in
        markdownContent.classList.remove('loading');
        
    } catch (error) {
        console.error('Error loading document:', error);
        markdownContent.innerHTML = '<div class="error">Failed to load document</div>';
        markdownContent.classList.remove('loading');
    }
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

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeDocList();
    initializeSearch();
    initializeMobileSidebar();
    initializeTheme();
    
    // Load the first document by default
    if (docs.length > 0) {
        loadDocument(docs[0].path);
    }
});
