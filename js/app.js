const audio = (() => {
    let instance = null;

    let createOrGet = () => {
        if (instance instanceof HTMLAudioElement) {
            return instance;
        }

        instance = new Audio();
        instance.autoplay = true;
        instance.src = document.getElementById('tombol-musik').getAttribute('data-url');
        instance.load();
        instance.currentTime = 0;
        instance.volume = 1;
        instance.muted = false;
        instance.loop = true;

        return instance;
    }

    return {
        play: () => {
            createOrGet().play();
        },
        pause: () => {
            createOrGet().pause();
        }
    };
})();

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const salin = (btn, msg = null) => {
    navigator.clipboard.writeText(btn.getAttribute('data-nomer'));
    let tmp = btn.innerHTML;
    btn.innerHTML = msg ?? 'Tersalin';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = tmp;
        btn.disabled = false;
        btn.focus();
    }, 1500);
};

const timer = () => {
    let countDownDate = (new Date(document.getElementById('tampilan-waktu').getAttribute('data-waktu').replace(' ', 'T'))).getTime();
    let time = null;
    let distance = null;

    time = setInterval(() => {
        distance = countDownDate - (new Date()).getTime();

        if (distance < 0) {
            clearInterval(time);
            time = null;
            return;
        }

        document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
};

const buka = async () => {
    document.getElementById('tombol-musik').style.display = 'block';
    audio.play();
    AOS.init();
    
    goToTop(); // Call the function to scroll to the top
    timer();
};

const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


const play = (btn) => {
    if (btn.getAttribute('data-status').toString() != 'true') {
        btn.setAttribute('data-status', 'true');
        audio.play();
        btn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    } else {
        btn.setAttribute('data-status', 'false');
        audio.pause();
        btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
};



const opacity = () => {
    let modal = new Promise((res) => {
        let clear = null;
        clear = setInterval(() => {
            if (document.getElementById('exampleModal').classList.contains('show')) {
                clearInterval(clear);
                res();
            }
        }, 100);
    });

    modal.then(() => {
        //progressBar.stop();

        let op = null;
        let clear = null;

        clear = setInterval(() => {
            if (op = null) {
                //op -= 0.025;
                document.getElementById('exampleModal').classList.add('fade');
            
            } else {
                //clearInterval(clear);
                //document.getElementById('loading').remove();
                document.getElementById('exampleModal').classList.add('fade');
            }
        }, 10);
    });
};


window.onload = function() {
    // Get the current URL's query parameters
    let modal = new bootstrap.Modal('#exampleModal');
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the 'to' parameter value
    const toValue = urlParams.get('to');
    
    // Display or use the extracted value
    if (toValue && toValue.length > 0) {
        let div = document.createElement('div');
        div.classList.add('m-2');
        div.innerHTML = `
        <p style="background-color: #f4f3ee;" class="mt-0 mb-1 mx-0 p-0">Kepada Yth Bapak/Ibu/Saudara/i</p>
        <h2 style="background-color: #f4f3ee;">${escapeHtml(toValue)}</h2>
        `;
        document.getElementById('namatamu').appendChild(div); // Append the div to the target element
    } else {
        document.getElementById('namatamu').remove(); // Remove the element if 'to' is empty
    }

    // Show the modal
    modal.show();
    
    // Call the opacity function if needed
    opacity();
}




