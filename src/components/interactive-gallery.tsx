// src/components/interactive-gallery.tsx
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import type { MediaItem } from '@/lib/data';

// Helper Utilities
class Utilities {
    static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }
}

interface InteractiveGalleryProps {
    items: MediaItem[];
    onImageSelect: (item: MediaItem) => void;
}

export function InteractiveGallery({ items, onImageSelect }: InteractiveGalleryProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationId = useRef<number>();
    const shapes = useRef<Shape[]>([]);
    const preloadedImages = useRef<HTMLImageElement[]>([]);
    
    const dimensions = useRef({ width: 0, height: 0 });
    const radius = useRef(0);
    const size = useRef(0);
    const numberOfShape = 16;

    const touchInfos = useRef({
        mouse: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
        isDragging: false,
        start: { x: 0, y: 0 },
    });

    const focus = useRef({ x: 0, y: 0, s: 0 });

    // Shape class defined inside the component or imported
    class Shape {
        ctx: CanvasRenderingContext2D;
        xIndex: number;
        yIndex: number;
        radius: number;
        numberOfShape: number;
        size: number;
        image: HTMLImageElement;
        mediaItem: MediaItem;
        ratio = 0;
        displayed = true;
        x = 0;
        y = 0;
        xRadian: number;
        yRadian: number;

        constructor(params: {
            c: CanvasRenderingContext2D; x: number; y: number;
            r: number; n: number; s: number;
            img: HTMLImageElement; item: MediaItem;
        }) {
            this.ctx = params.c;
            this.xIndex = params.x;
            this.yIndex = params.y;
            this.radius = params.r;
            this.numberOfShape = params.n;
            this.size = params.s;
            this.image = params.img;
            this.mediaItem = params.item;
            this.xRadian = (Math.PI * 2 / this.numberOfShape) * this.xIndex;
            this.yRadian = (Math.PI * 2 / this.numberOfShape) * this.yIndex;
        }

        updateParams(infos: typeof touchInfos.current) {
            this.x = Math.sin(this.xRadian + infos.delta.x) * this.radius;
            this.y = Math.cos(this.yRadian + infos.delta.y) * this.radius;
            const tmp = 1 - Math.min(this.ease(Math.sqrt(this.x * this.x + this.y * this.y) / this.radius), 1);
            this.ratio = tmp;
        }

        ease(t: number) { return t * t * t; }

        draw(infos: typeof touchInfos.current) {
            this.updateParams(infos);
            if (Math.sin(this.yRadian + infos.delta.y) > 0 || Math.cos(this.xRadian + infos.delta.x) > 0) {
                this.displayed = false;
                return;
            }
            this.displayed = true;

            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.scale(this.ratio, this.ratio);
            this.ctx.translate(-this.x, -this.y);
            this.ctx.globalAlpha = this.ratio;
            
            const imgSize = this.size;
            const imgX = this.x - imgSize / 2;
            const imgY = this.y - imgSize / 2;

            this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, imgX, imgY, imgSize, imgSize);
            this.ctx.restore();
        }
    }

    const setupShapes = useCallback((ctx: CanvasRenderingContext2D) => {
        const edge = Math.max(dimensions.current.width, dimensions.current.height);
        radius.current = edge / 2;
        size.current = radius.current / (numberOfShape / 6);
        focus.current.s = size.current;
        shapes.current = [];
        
        let imageIndex = 0;
        for (let x = 0; x < numberOfShape; x++) {
            for (let y = 0; y < numberOfShape; y++) {
                if (imageIndex >= preloadedImages.current.length) imageIndex = 0; // Loop images
                const params = {
                    x, y,
                    c: ctx,
                    s: size.current,
                    r: radius.current,
                    n: numberOfShape,
                    img: preloadedImages.current[imageIndex],
                    item: items[imageIndex],
                };
                shapes.current.push(new Shape(params));
                imageIndex++;
            }
        }
    }, [items]);

    const isHovered = (shape: Shape, x: number, y: number) => {
        const shapeSize = size.current * shape.ratio / 2;
        return (
            shape.displayed &&
            x > shape.x - shapeSize && x < shape.x + shapeSize &&
            y > shape.y - shapeSize && y < shape.y + shapeSize
        );
    };

    const drawFocus = useCallback((ctx: CanvasRenderingContext2D, hoveredShape: Shape | null) => {
        if (hoveredShape) {
            focus.current.s += (size.current * hoveredShape.ratio - focus.current.s) * 0.16;
            focus.current.x += (hoveredShape.x - focus.current.x) * 0.16;
            focus.current.y += (hoveredShape.y - focus.current.y) * 0.16;
        } else {
            focus.current.s += (0 - focus.current.s) * 0.16;
            focus.current.x += (touchInfos.current.mouse.x - focus.current.x) * 0.16;
            focus.current.y += (touchInfos.current.mouse.y - focus.current.y) * 0.16;
        }
        
        ctx.save();
        ctx.strokeStyle = '#FF0000'; // Bright Red
        ctx.lineWidth = hoveredShape ? 3 * hoveredShape.ratio : 1;
        ctx.strokeRect(
            focus.current.x - focus.current.s / 2, 
            focus.current.y - focus.current.s / 2, 
            focus.current.s, 
            focus.current.s
        );
        ctx.restore();
    }, []);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, dimensions.current.width, dimensions.current.height);
        ctx.save();
        ctx.translate(dimensions.current.width / 2, dimensions.current.height / 2);

        let hoveredShape: Shape | null = null;
        let hasHover = false;

        for (const shape of shapes.current) {
            shape.draw(touchInfos.current);
            if (isHovered(shape, touchInfos.current.mouse.x, touchInfos.current.mouse.y)) {
                hasHover = true;
                hoveredShape = shape;
            }
        }
        
        canvas.style.cursor = hasHover ? 'pointer' : 'grab';
        drawFocus(ctx, hoveredShape);

        ctx.restore();
        animationId.current = requestAnimationFrame(render);
    }, [drawFocus]);


    useEffect(() => {
        let loadedCount = 0;
        const imagesToLoad = items.length;
        
        items.forEach(item => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = item.src;
            img.onload = () => {
                loadedCount++;
                preloadedImages.current.push(img);
                if (loadedCount === imagesToLoad) {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    const container = canvas.parentElement;
                    if (!container) return;
                    
                    dimensions.current.width = container.clientWidth;
                    dimensions.current.height = container.clientHeight;
                    canvas.width = dimensions.current.width;
                    canvas.height = dimensions.current.height;
                    
                    setupShapes(ctx);
                    if (animationId.current) cancelAnimationFrame(animationId.current);
                    animationId.current = requestAnimationFrame(render);
                }
            };
        });

        const handleResize = () => {
             const canvas = canvasRef.current;
            if (!canvas || !canvas.parentElement) return;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            
            dimensions.current.width = canvas.parentElement.clientWidth;
            dimensions.current.height = canvas.parentElement.clientHeight;
            canvas.width = dimensions.current.width;
            canvas.height = dimensions.current.height;
            setupShapes(ctx);
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationId.current) {
                cancelAnimationFrame(animationId.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [items, render, setupShapes]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        touchInfos.current.mouse.x = e.clientX - rect.left - dimensions.current.width / 2;
        touchInfos.current.mouse.y = e.clientY - rect.top - dimensions.current.height / 2;

        if (touchInfos.current.isDragging) {
            const dx = e.clientX - touchInfos.current.start.x;
            const dy = e.clientY - touchInfos.current.start.y;
            touchInfos.current.delta.x += dx * 0.001;
            touchInfos.current.delta.y -= dy * 0.001;
            touchInfos.current.start = { x: e.clientX, y: e.clientY };
        }
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        touchInfos.current.isDragging = true;
        touchInfos.current.start = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        touchInfos.current.isDragging = false;
    };
    
    const handleMouseLeave = () => {
        touchInfos.current.isDragging = false;
    };

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        touchInfos.current.delta.x += e.deltaX * 0.0005;
        touchInfos.current.delta.y -= e.deltaY * 0.0005;
    };

    const handleClick = () => {
        for (const shape of shapes.current) {
            if (isHovered(shape, touchInfos.current.mouse.x, touchInfos.current.mouse.y)) {
                onImageSelect(shape.mediaItem);
                return;
            }
        }
    };

    return (
        <div className="interactive-gallery-container">
            <canvas
                ref={canvasRef}
                className="interactive-gallery-canvas"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
                onClick={handleClick}
            />
        </div>
    );
}
