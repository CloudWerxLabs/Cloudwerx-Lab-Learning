class SVGEditor {
    constructor() {
        this.currentTool = 'select';
        this.isDrawing = false;
        this.startPoint = null;
        this.currentShape = null;
        this.selectedShape = null;
        this.shapeStyles = {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2
        };
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;
        this.gridEnabled = false;
        this.snapEnabled = false;
        this.initSVG();
        this.initTools();
        this.initEventListeners();
        this.initMenuListeners();
    }

    initSVG() {
        const container = document.querySelector('#drawing-area');
        this.draw = SVG().addTo(container).size('100%', '100%');
        this.draw.viewbox(0, 0, 1200, 800);
        this.draw.rect(1200, 800).fill('#fff');
    }

    initTools() {
        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                this.currentTool = tool.getAttribute('data-tool');
                this.updateCursor();
                console.log('Selected tool:', this.currentTool);
            });
        });
    }

    updateCursor() {
        const container = document.querySelector('#drawing-area');
        switch(this.currentTool) {
            case 'select':
                container.style.cursor = 'default';
                break;
            case 'rectangle':
            case 'circle':
            case 'line':
                container.style.cursor = 'crosshair';
                break;
            case 'text':
                container.style.cursor = 'text';
                break;
            default:
                container.style.cursor = 'default';
        }
    }

    getMousePosition(event) {
        const container = document.querySelector('#drawing-area');
        const rect = container.getBoundingClientRect();
        const scaleX = 1200 / rect.width;
        const scaleY = 800 / rect.height;
        
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    selectShape(shape) {
        if (this.selectedShape) {
            this.selectedShape.stroke({ width: this.shapeStyles.strokeWidth });
        }
        this.selectedShape = shape;
        if (shape) {
            shape.stroke({ width: this.shapeStyles.strokeWidth + 1 });
            document.getElementById('fillColor').value = shape.fill();
            document.getElementById('strokeColor').value = shape.stroke().color;
            document.getElementById('strokeWidth').value = shape.stroke().width;
            document.getElementById('strokeWidthValue').textContent = shape.stroke().width + 'px';
        }
    }

    applyCurrentStyles(shape) {
        shape.fill(this.shapeStyles.fill)
             .stroke({ color: this.shapeStyles.stroke, width: this.shapeStyles.strokeWidth });
        return shape;
    }

    initEventListeners() {
        const container = document.querySelector('#drawing-area');

        document.getElementById('fillColor').addEventListener('change', (e) => {
            this.shapeStyles.fill = e.target.value;
            if (this.selectedShape) {
                this.selectedShape.fill(e.target.value);
            }
        });

        document.getElementById('strokeColor').addEventListener('change', (e) => {
            this.shapeStyles.stroke = e.target.value;
            if (this.selectedShape) {
                this.selectedShape.stroke({ color: e.target.value });
            }
        });

        document.getElementById('strokeWidth').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.shapeStyles.strokeWidth = value;
            document.getElementById('strokeWidthValue').textContent = value + 'px';
            if (this.selectedShape) {
                this.selectedShape.stroke({ width: value });
            }
        });

        document.getElementById('deleteShape').addEventListener('click', () => {
            if (this.selectedShape) {
                this.selectedShape.remove();
                this.selectedShape = null;
            }
        });

        document.getElementById('duplicateShape').addEventListener('click', () => {
            if (this.selectedShape) {
                const clone = this.selectedShape.clone();
                clone.move(this.selectedShape.x() + 20, this.selectedShape.y() + 20);
                this.selectShape(clone);
                
                clone.click((e) => {
                    e.stopPropagation();
                    this.selectShape(clone);
                });
            }
        });

        container.addEventListener('mousedown', (e) => {
            if (this.currentTool === 'select') {
                if (e.target === container || e.target.tagName === 'svg') {
                    this.selectShape(null);
                }
                return;
            }
            
            this.isDrawing = true;
            this.startPoint = this.getMousePosition(e);

            switch(this.currentTool) {
                case 'rectangle':
                    this.currentShape = this.draw.rect().move(this.startPoint.x, this.startPoint.y);
                    break;
                case 'circle':
                    this.currentShape = this.draw.circle().move(this.startPoint.x, this.startPoint.y);
                    break;
                case 'line':
                    this.currentShape = this.draw.line()
                        .plot(this.startPoint.x, this.startPoint.y, this.startPoint.x, this.startPoint.y);
                    break;
            }

            if (this.currentShape) {
                this.applyCurrentStyles(this.currentShape);
                this.currentShape.click((e) => {
                    e.stopPropagation();
                    this.selectShape(this.currentShape);
                });
            }
        });

        container.addEventListener('mousemove', (e) => {
            if (!this.isDrawing || !this.currentShape) return;

            const currentPoint = this.getMousePosition(e);

            switch(this.currentTool) {
                case 'rectangle':
                    const width = currentPoint.x - this.startPoint.x;
                    const height = currentPoint.y - this.startPoint.y;
                    this.currentShape
                        .move(width < 0 ? currentPoint.x : this.startPoint.x,
                              height < 0 ? currentPoint.y : this.startPoint.y)
                        .size(Math.abs(width), Math.abs(height));
                    break;
                case 'circle':
                    const radius = Math.sqrt(
                        Math.pow(currentPoint.x - this.startPoint.x, 2) +
                        Math.pow(currentPoint.y - this.startPoint.y, 2)
                    );
                    this.currentShape
                        .center(this.startPoint.x, this.startPoint.y)
                        .radius(radius / 2);
                    break;
                case 'line':
                    this.currentShape
                        .plot(this.startPoint.x, this.startPoint.y, currentPoint.x, currentPoint.y);
                    break;
            }
        });

        container.addEventListener('mouseup', () => {
            if (this.currentShape) {
                this.selectShape(this.currentShape);
            }
            this.isDrawing = false;
            this.currentShape = null;
        });

        container.addEventListener('mouseleave', () => {
            if (this.currentShape && this.isDrawing) {
                this.currentShape.remove();
            }
            this.isDrawing = false;
            this.currentShape = null;
        });
    }

    initMenuListeners() {
        // File operations
        document.getElementById('newFile').addEventListener('click', () => {
            if (confirm('Clear canvas? All unsaved changes will be lost.')) {
                this.draw.clear();
                this.draw.rect(1200, 800).fill('#fff');
            }
        });

        // Add hidden file input for opening files
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.svg';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        document.getElementById('openFile').addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Parse the SVG content
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(event.target.result, 'image/svg+xml');
                    
                    // Clear current canvas
                    this.draw.clear();
                    
                    // Create background
                    this.draw.rect(1200, 800).fill('#fff');
                    
                    // Import each shape from the loaded SVG
                    const shapes = svgDoc.querySelectorAll('rect, circle, line, text');
                    shapes.forEach(shape => {
                        let newShape;
                        const tagName = shape.tagName.toLowerCase();
                        
                        switch(tagName) {
                            case 'rect':
                                newShape = this.draw.rect(
                                    parseFloat(shape.getAttribute('width')),
                                    parseFloat(shape.getAttribute('height'))
                                ).move(
                                    parseFloat(shape.getAttribute('x') || 0),
                                    parseFloat(shape.getAttribute('y') || 0)
                                );
                                break;
                                
                            case 'circle':
                                newShape = this.draw.circle(
                                    parseFloat(shape.getAttribute('r')) * 2
                                ).move(
                                    parseFloat(shape.getAttribute('cx') || 0) - parseFloat(shape.getAttribute('r')),
                                    parseFloat(shape.getAttribute('cy') || 0) - parseFloat(shape.getAttribute('r'))
                                );
                                break;
                                
                            case 'line':
                                newShape = this.draw.line(
                                    parseFloat(shape.getAttribute('x1') || 0),
                                    parseFloat(shape.getAttribute('y1') || 0),
                                    parseFloat(shape.getAttribute('x2') || 0),
                                    parseFloat(shape.getAttribute('y2') || 0)
                                );
                                break;
                                
                            case 'text':
                                newShape = this.draw.text(shape.textContent).move(
                                    parseFloat(shape.getAttribute('x') || 0),
                                    parseFloat(shape.getAttribute('y') || 0)
                                );
                                break;
                        }
                        
                        if (newShape) {
                            // Apply styles
                            if (shape.getAttribute('fill')) {
                                newShape.fill(shape.getAttribute('fill'));
                            }
                            if (shape.getAttribute('stroke')) {
                                newShape.stroke({
                                    color: shape.getAttribute('stroke'),
                                    width: shape.getAttribute('stroke-width') || 1
                                });
                            }
                            
                            // Make shape selectable
                            newShape.click((e) => {
                                e.stopPropagation();
                                this.selectShape(newShape);
                            });
                        }
                    });
                    
                    // Add to history
                    this.addToHistory();
                };
                reader.readAsText(file);
            }
        });

        document.getElementById('saveFile').addEventListener('click', () => {
            const svgData = this.draw.svg();
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'drawing.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Undo/Redo
        document.getElementById('undo').addEventListener('click', () => {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.draw.clear();
                this.draw.svg(this.history[this.historyIndex]);
            }
        });

        document.getElementById('redo').addEventListener('click', () => {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.draw.clear();
                this.draw.svg(this.history[this.historyIndex]);
            }
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoom = Math.min(this.zoom * 1.2, 5);
            this.updateZoom();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoom = Math.max(this.zoom / 1.2, 0.2);
            this.updateZoom();
        });

        document.getElementById('resetZoom').addEventListener('click', () => {
            this.zoom = 1;
            this.updateZoom();
        });

        // Grid and snap
        document.getElementById('gridToggle').addEventListener('click', (e) => {
            this.gridEnabled = !this.gridEnabled;
            e.currentTarget.classList.toggle('active');
            this.toggleGrid();
        });

        document.getElementById('snapToggle').addEventListener('click', (e) => {
            this.snapEnabled = !this.snapEnabled;
            e.currentTarget.classList.toggle('active');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        document.getElementById('newFile').click();
                        break;
                    case 's':
                        e.preventDefault();
                        document.getElementById('saveFile').click();
                        break;
                    case 'z':
                        e.preventDefault();
                        document.getElementById('undo').click();
                        break;
                    case 'y':
                        e.preventDefault();
                        document.getElementById('redo').click();
                        break;
                    case 'd':
                        e.preventDefault();
                        document.getElementById('duplicateShape').click();
                        break;
                }
            }
            // Tool shortcuts
            switch(e.key.toLowerCase()) {
                case 'v':
                    document.querySelector('[data-tool="select"]').click();
                    break;
                case 'r':
                    document.querySelector('[data-tool="rectangle"]').click();
                    break;
                case 'c':
                    document.querySelector('[data-tool="circle"]').click();
                    break;
                case 'l':
                    document.querySelector('[data-tool="line"]').click();
                    break;
                case 't':
                    document.querySelector('[data-tool="text"]').click();
                    break;
                case 'Delete':
                    document.getElementById('deleteShape').click();
                    break;
            }
        });
    }

    updateZoom() {
        const viewbox = this.draw.viewbox();
        const width = 1200 / this.zoom;
        const height = 800 / this.zoom;
        const x = (1200 - width) / 2;
        const y = (800 - height) / 2;
        this.draw.viewbox(x, y, width, height);
    }

    toggleGrid() {
        if (this.gridEnabled) {
            // Create grid pattern
            const gridSize = 20;
            const pattern = this.draw.pattern(gridSize, gridSize, (add) => {
                add.line(0, 0, 0, gridSize).stroke({ color: '#ccc', width: 0.5 });
                add.line(0, 0, gridSize, 0).stroke({ color: '#ccc', width: 0.5 });
            });
            
            // Apply grid to background
            this.draw.rect(1200, 800).fill(pattern).back();
        } else {
            // Remove grid
            this.draw.clear();
            this.draw.rect(1200, 800).fill('#fff');
            // Redraw all shapes
            // TODO: Implement shape restoration
        }
    }

    addToHistory() {
        // Remove any redo states
        this.history = this.history.slice(0, this.historyIndex + 1);
        // Add current state
        this.history.push(this.draw.svg());
        this.historyIndex = this.history.length - 1;
    }
}

window.addEventListener('load', () => {
    console.log('Initializing SVG Editor');
    window.editor = new SVGEditor();
});
