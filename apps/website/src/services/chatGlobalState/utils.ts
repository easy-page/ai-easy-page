export async function convertUrlToBase64UsingFetch(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // 去除前缀 'data:type;base64,'
            const base64WithoutPrefix = base64data.split(',')[1];
            resolve(base64WithoutPrefix);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function getMainMinWidth() {
    if (window.innerWidth >= 1536) return 500; // 2xl
    if (window.innerWidth >= 1280) return 500; // xl
    if (window.innerWidth >= 1024) return 400; // lg
    if (window.innerWidth >= 768) return 300; // md
    return 260;
}
