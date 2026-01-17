/**
 * Add external link icons to links that point outside the current domain
 * Based on Astro recipe: https://docs.astro.build/en/recipes/external-links/
 */

export function addExternalLinkIcons() {
  if (typeof document === 'undefined') return;

  const links = document.querySelectorAll('a[href]');
  const currentHost = window.location.hostname;

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Skip if already has external icon
    if (link.querySelector('.external-link-icon')) return;

    // Check if link is external
    try {
      const url = new URL(href, window.location.href);
      const isExternal = url.hostname !== currentHost && url.hostname !== '';

      if (isExternal) {
        // Add external link icon
        const icon = document.createElement('svg');
        icon.className = 'external-link-icon inline-block w-3 h-3 ml-1 text-secondary';
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />';
        
        link.appendChild(icon);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Update aria-label if it doesn't already indicate external link
        const ariaLabel = link.getAttribute('aria-label');
        if (ariaLabel && !ariaLabel.toLowerCase().includes('external') && !ariaLabel.toLowerCase().includes('externe')) {
          link.setAttribute('aria-label', `${ariaLabel} (opens in new tab)`);
        }
      }
    } catch {
      // Invalid URL, skip
    }
  });
}
