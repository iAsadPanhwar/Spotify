console.log("Lets Write Javascript")


async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || (element.href.endsWith(".m4a"))) {
            songs.push(element.href.split("/songs/")[1])
        }
    }

    return songs


}

async function main() {
    // Get the list of all songs
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        let decodedSong = decodeURIComponent(song);  // Decode URL-encoded characters
        let cleanedSong = decodedSong.replaceAll("%20", " ") // Replace %20 with space
            .replace(/[\uD800-\uFFFF]/g, ""); // Remove emojis

        songUL.innerHTML += `<li>${cleanedSong}</li>`;
    }

    // Create an audio element but do not autoplay
    var audio = new Audio(songs[0]);
    audio.play()
    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.duration, audio.currentTime)
    })

}

main();
