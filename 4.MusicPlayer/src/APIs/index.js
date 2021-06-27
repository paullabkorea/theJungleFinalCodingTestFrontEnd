export const fetchMusics = async () => {
    const response = await fetch('/musics');

    return await response.json();
}