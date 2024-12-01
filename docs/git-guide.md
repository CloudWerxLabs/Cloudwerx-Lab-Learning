# Git Guide

## Introduction
Git is a distributed version control system that helps track changes in source code during software development. This guide covers essential Git concepts and practices.

## Basic Concepts

### Repository (Repo)
- A container for your project
- Contains all project files and version history
- Can be local or remote

### Commits
- Snapshots of your project at a specific point
- Include commit message describing changes
- Have unique identifiers (hash)

### Branches
- Independent lines of development
- `main` (or `master`) is the default branch
- Feature branches for new development

## Essential Commands

### Repository Setup
```bash
# Initialize a new repository
git init

# Clone an existing repository
git clone <repository-url>
```

### Basic Workflow
```bash
# Check status of working directory
git status

# Stage changes for commit
git add <file>
git add .  # Stage all changes

# Commit changes
git commit -m "commit message"

# Push changes to remote
git push origin <branch-name>
```

### Branch Operations
```bash
# Create new branch
git branch <branch-name>

# Switch to branch
git checkout <branch-name>

# Create and switch in one command
git checkout -b <branch-name>

# List branches
git branch
```

## Advanced Features

### Stashing
```bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply stashed changes
git stash apply
```

### Merging
```bash
# Merge branch into current branch
git merge <branch-name>

# Abort merge in case of conflicts
git merge --abort
```

### Rebasing
```bash
# Rebase current branch
git rebase <branch-name>

# Interactive rebase
git rebase -i HEAD~<number>
```

## Best Practices

### Commit Messages
1. Use present tense ("Add feature" not "Added feature")
2. Keep first line under 50 characters
3. Include context in body if needed
4. Reference issue numbers when applicable

### Branch Strategy
1. Keep `main` branch stable
2. Create feature branches for new work
3. Use descriptive branch names
4. Delete merged branches

### Workflow Guidelines
1. Commit early and often
2. Pull before pushing
3. Review changes before committing
4. Write meaningful commit messages

## Common Patterns

### Feature Branch Workflow
1. Create feature branch
2. Make changes
3. Push to remote
4. Create pull request
5. Review and merge

### Gitflow Workflow
1. `main` for production
2. `develop` for development
3. Feature branches
4. Release branches
5. Hotfix branches

## Troubleshooting

### Common Issues
1. Merge conflicts
2. Detached HEAD state
3. Lost commits
4. Large file issues

### Solutions
```bash
# Fix merge conflicts
git status  # Check conflicted files
git add <resolved-file>
git commit

# Recover lost commits
git reflog
git checkout <commit-hash>

# Undo last commit
git reset --soft HEAD~1
```

## Advanced Topics

### Git Hooks
- Pre-commit hooks
- Post-commit hooks
- Pre-push hooks
- Custom scripts

### Submodules
```bash
# Add submodule
git submodule add <repository-url>

# Update submodules
git submodule update --init --recursive
```

### Git LFS
- Large File Storage
- Binary file handling
- Media file management

## Performance

### Repository Optimization
```bash
# Garbage collection
git gc

# Prune old objects
git prune

# Compress objects
git repack
```

### Best Practices
1. Use .gitignore properly
2. Regular maintenance
3. Optimize large repositories
4. Clean up old branches

## Security

### Best Practices
1. Never commit secrets
2. Use SSH keys
3. Sign commits
4. Audit access

### Configuration
```bash
# Configure GPG signing
git config --global commit.gpgsign true

# Set up SSH key
git config --global core.sshCommand "ssh -i ~/.ssh/id_rsa"
```

## Integration

### CI/CD
1. GitHub Actions
2. GitLab CI
3. Jenkins
4. Travis CI

### Tools
1. Git GUI clients
2. IDE integrations
3. Command-line tools
4. Merge tools

## Additional Resources

### Documentation
- [Official Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Git Reference](https://git-scm.com/docs)

### Tools
- [GitHub Desktop](https://desktop.github.com/)
- [GitKraken](https://www.gitkraken.com/)
- [SourceTree](https://www.sourcetreeapp.com/)

## Glossary

### Common Terms
- **Repository**: Project container
- **Commit**: Snapshot of changes
- **Branch**: Independent development line
- **Merge**: Combine branches
- **Remote**: Server-hosted repository
- **Clone**: Copy of repository
- **Pull Request**: Change proposal
- **Fork**: Repository copy
