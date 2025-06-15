/**
 * Info Box Management Module
 * Handles tooltip positioning and interactions
 */

export class InfoBoxManager {
    private infoIcons: NodeListOf<Element>;

    constructor() {
        this.infoIcons = document.querySelectorAll('.info-icon');
        this.initialize();
    }

    /**
     * Initialize info box functionality
     */
    private initialize(): void {
        this.infoIcons.forEach(icon => {
            // Handle click events (mobile and desktop)
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close all other tooltips first
                this.infoIcons.forEach(otherIcon => {
                    if (otherIcon !== icon) {
                        otherIcon.classList.remove('active');
                    }
                });
                
                // Toggle current tooltip and position it
                icon.classList.toggle('active');
                if (icon.classList.contains('active')) {
                    this.positionTooltip(icon);
                }
            });

            // Handle mouse events for desktop
            icon.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) { // Desktop only
                    icon.classList.add('active');
                    this.positionTooltip(icon);
                }
            });

            icon.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) { // Desktop only
                    // Delay hiding to allow users to interact with tooltip
                    setTimeout(() => {
                        if (!icon.matches(':hover')) {
                            icon.classList.remove('active');
                        }
                    }, 200);
                }
            });
        });

        // Close tooltips when clicking elsewhere
        document.addEventListener('click', (e) => {
            const target = e.target as Element;
            if (!target.closest('.info-icon')) {
                this.infoIcons.forEach(icon => {
                    icon.classList.remove('active');
                });
            }
        });
        
        // Reposition tooltips on scroll/resize
        window.addEventListener('scroll', () => {
            const activeIcon = document.querySelector('.info-icon.active');
            if (activeIcon) {
                this.positionTooltip(activeIcon);
            }
        });
        
        window.addEventListener('resize', () => {
            const activeIcon = document.querySelector('.info-icon.active');
            if (activeIcon) {
                this.positionTooltip(activeIcon);
            }
        });
    }

    /**
     * Position tooltip dynamically to prevent cutoff
     */
    private positionTooltip(icon: Element): void {
        const tooltip = icon.querySelector('.tooltip') as HTMLElement;
        if (!tooltip) return;

        // Make tooltip visible temporarily to get accurate measurements
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '1';
        tooltip.style.position = 'fixed';
        tooltip.style.top = '0px';
        tooltip.style.left = '0px';
        tooltip.style.transform = 'none';

        const iconRect = icon.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 20; // Safety margin from viewport edges

        // Calculate tooltip dimensions
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        // Calculate horizontal position (centered on icon)
        let left = iconRect.left + iconRect.width / 2;
        
        // Adjust for horizontal viewport constraints
        const minLeft = margin;
        const maxLeft = viewportWidth - tooltipWidth - margin;
        left = Math.max(minLeft, Math.min(maxLeft, left - tooltipWidth / 2));

        // Calculate vertical position (prefer above icon)
        let top = iconRect.top - tooltipHeight - 10;
        let showAbove = true;

        // Check if tooltip fits above
        if (top < margin) {
            // Try below icon
            const bottomPosition = iconRect.bottom + 10;
            if (bottomPosition + tooltipHeight + margin <= viewportHeight) {
                top = bottomPosition;
                showAbove = false;
            } else {
                // Neither above nor below fits well, choose best option
                const spaceAbove = iconRect.top - margin;
                const spaceBelow = viewportHeight - iconRect.bottom - margin;
                
                if (spaceAbove > spaceBelow) {
                    top = margin;
                    showAbove = true;
                } else {
                    top = viewportHeight - tooltipHeight - margin;
                    showAbove = false;
                }
            }
        }

        // Apply final positioning
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.transform = 'none';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '0'; // Will be animated by CSS

        // Update arrow classes for styling
        tooltip.classList.toggle('tooltip-above', showAbove);
        tooltip.classList.toggle('tooltip-below', !showAbove);
    }

    /**
     * Close all open tooltips
     */
    public closeAllTooltips(): void {
        this.infoIcons.forEach(icon => {
            icon.classList.remove('active');
        });
    }
} 