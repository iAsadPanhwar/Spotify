console.log("Lets Write Javascript")
let currentSong = new Audio();
let songs;
let currFolder;

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

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            songs.push(element.href.split('/').pop()); // Get only filename
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
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
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })
         }
    )
}

const playMusic = (track, pause = false) => { 
    currentSong.src = `${currFolder.replace(/\/$/, '')}/${track}`; // Remove extra slash
    if (!pause) {
        currentSong.play();
        play.src = "http://127.0.0.1:3000/img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    
};

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let folders = []
    Array.from(anchors).forEach(e=>{
        if(e.href.includes("/songs")){
            
        }
    })
}

async function main() {

    
    // Get the list of all songs
    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    // Display All albums


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
    })

    // Add an event Listener for close button in Hemburger
    document.querySelector(".close").addEventListener("click",() => { 
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event Listener for Previous Song
    previous.addEventListener("click",() => { 
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]) 
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
    
    // Add an event Listener for Next Song
    next.addEventListener("click",() => { 
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]) 
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) => { 
       currentSong.volume = parseInt(e.target.value)/100
    })

    // Load the library when Ever Album is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {  
            let folder = item.currentTarget.getAttribute("data-folder");
            await getSongs(`songs/${folder}`); 
        });
    });
    
}

main();
