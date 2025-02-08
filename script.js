console.log("Lets Write Javascript")
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds){
    if (isNaN(seconds)|| seconds<0){
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, "0")
    const formattedSeconds = String(remainingSeconds).padStart(2, "0")

    return `${formattedMinutes}:${formattedSeconds}`
}

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

const playMusic = (track, pause=false) => { 
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "http://127.0.0.1:3000/img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00" 
}

async function main() {

    
    // Get the list of all songs
    songs = await getSongs();
    playMusic(songs[0], true)

    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        let decodedSong = decodeURIComponent(song);  // Decode URL-encoded characters
        let cleanedSong = decodedSong.replaceAll("%20", " ") // Replace %20 with space
            .replace(/[\uD800-\uFFFF]/g, ""); // Remove emojis

        songUL.innerHTML += `<li><img class="invert" src="img/music.svg" alt="Music">
                            <div class="info">
                                <div>${cleanedSong}</div>
                                <div>Asad</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }

    // Attach an event Listener to each Song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {e.addEventListener("click", (element) => { 
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })
         }
    )

    // Attach and event listener to play, next and previous
    play.addEventListener("click", () => { 
        if(currentSong.paused){
            currentSong.play()
            play.src = "http://127.0.0.1:3000/img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "http://127.0.0.1:3000/img/play.svg"
        }
    })

    // Listen for timeupdated event
    currentSong.addEventListener("timeupdate", () => { 
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutesSeconds(currentSong.currentTime)} / 
        ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add an Event Listener to Seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => { 
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) /100
    })
    // Add an event Listener to Hemburger
    document.querySelector(".hamburger").addEventListener("click", () => { 
        document.querySelector(".left").style.left = "0"
        console.log("hi")
    })

    // Add an event Listener for close button in Hemburger
    document.querySelector(".close").addEventListener("click",() => { 
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event Listener for Previous Song
    previous.addEventListener("click",() => { 
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]) 
        console.log(songs, index)
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
    
    // Add an event Listener for Next Song
    next.addEventListener("click",() => { 
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]) 
        console.log(songs, index)
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
    
}

main();
