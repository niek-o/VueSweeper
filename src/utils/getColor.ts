export function getColor(color: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(color);
}