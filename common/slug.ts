export const slug = (text: string) => {
    return text.toLowerCase().replaceAll(/\W+/g, '-');
}