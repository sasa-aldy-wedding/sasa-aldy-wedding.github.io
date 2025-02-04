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

const resetForm = () => {
    document.getElementById('kirim').style.display = 'block';
    document.getElementById('hadiran').style.display = 'block';
    document.getElementById('labelhadir').style.display = 'block';
    document.getElementById('batal').style.display = 'none';
    document.getElementById('kirimbalasan').style.display = 'none';
    document.getElementById('idbalasan').value = null;
    document.getElementById('balasan').innerHTML = null;
    document.getElementById('formnama').value = null;
    document.getElementById('hadiran').value = 0;
    document.getElementById('formpesan').value = null;
};

const parseRequest = (method, token = null, body = null) => {
    let req = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        req.headers['Authorization'] = 'Bearer ' + token;
    }

    if (body) {
        req.body = JSON.stringify(body);
    }

    return req;
};

const getUrl = (optional = null) => {
    let url = document.querySelector('body').getAttribute('data-url');

    if (url.slice(-1) == '/') {
        url = url.slice(0, -1);
    }

    if (optional) {
        return url + optional;
    }

    return url;
};





const getTempLike = (key = null) => {
    if (!localStorage.getItem('likes')) {
        localStorage.setItem('likes', JSON.stringify({}));
    }

    if (key) {
        return JSON.parse(localStorage.getItem('likes'))[key];
    }

    return JSON.parse(localStorage.getItem('likes'));
};

const setTempLike = (key, value) => {
    let storage = getTempLike();
    storage[key] = value;
    localStorage.setItem('likes', JSON.stringify(storage));
};

const removeTempLike = (key) => {
    let storage = getTempLike();
    delete storage[key];
    localStorage.setItem('likes', JSON.stringify(storage));
};

const inTempLike = (key) => {
    return Object.keys(getTempLike()).includes(key);
};


const innerCard = (comment) => {
    let result = '';

    comment.forEach((data) => {
        result += `
        <div class="card-body border-start bg-light py-2 ps-2 pe-0 my-2 ms-2 me-0" id="${data.uuid}">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                    <strong>${escapeHtml(data.nama)}</strong>
                </p>
                <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${data.created_at}</small>
            </div>
            <hr class="text-dark my-1">
            <p class="text-dark mt-0 mb-1 mx-0 p-0" style="white-space: pre-line">${escapeHtml(data.komentar)}</p>
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <button style="font-size: 0.8rem;" onclick="balasan(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-3 py-0">Balas</button>
                <button style="font-size: 0.8rem;" onclick="like(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-2 py-0 px-0">
                    <div class="d-flex justify-content-start align-items-center">
                        <p class="my-0 mx-1" data-suka="${data.like.love}">${data.like.love} suka</p>
                        <i class="py-1 me-1 p-0 ${inTempLike(data.uuid) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'}"></i>
                    </div>
                </button>
            </div>
            ${innerCard(data.comments)}
        </div>`;
    });

    return result;
};

const renderCard = (data) => {
    const DIV = document.createElement('div');
    DIV.classList.add('mb-3');
    DIV.innerHTML = `
    <div class="card-body bg-light shadow p-3 m-0 rounded-4" id="${data.uuid}">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
            <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                <strong class="me-1">${escapeHtml(data.nama)}</strong><i class="fa-solid ${data.hadir ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}"></i>
            </p>
            <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${data.created_at}</small>
        </div>
        <hr class="text-dark my-1">
        <p class="text-dark mt-0 mb-1 mx-0 p-0" style="white-space: pre-line">${escapeHtml(data.komentar)}</p>
        <div class="d-flex flex-wrap justify-content-between align-items-center">
            <button style="font-size: 0.8rem;" onclick="balasan(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-3 py-0">Balas</button>
            <button style="font-size: 0.8rem;" onclick="like(this)" data-uuid="${data.uuid}" class="btn btn-sm btn-outline-dark rounded-2 py-0 px-0">
                <div class="d-flex justify-content-start align-items-center">
                    <p class="my-0 mx-1" data-suka="${data.like.love}">${data.like.love} suka</p>
                    <i class="py-1 me-1 p-0 ${inTempLike(data.uuid) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'}"></i>
                </div>
            </button>
        </div>
        ${innerCard(data.comments)}
    </div>`;
    return DIV;
};

const renderLoading = (num) => {
    let hasil = '';
    for (let index = 0; index < num; index++) {
        hasil += `
        <div class="mb-3">
            <div class="card-body bg-light shadow p-3 m-0 rounded-4">
                <div class="d-flex flex-wrap justify-content-between align-items-center placeholder-glow">
                    <span class="placeholder bg-secondary col-5"></span>
                    <span class="placeholder bg-secondary col-3"></span>
                </div>
                <hr class="text-dark my-1">
                <p class="card-text placeholder-glow">
                    <span class="placeholder bg-secondary col-6"></span>
                    <span class="placeholder bg-secondary col-5"></span>
                    <span class="placeholder bg-secondary col-12"></span>
                </p>
            </div>
        </div>`;
    }

    return hasil;
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

const modalFoto = (img) => {
    let modal = new bootstrap.Modal('#modalFoto');
    document.getElementById('showModalFoto').src = img.src;
    modal.show();
};
window.addEventListener('load', () => {
    let modal = new bootstrap.Modal('#exampleModal');
    
    let name = (new URLSearchParams(window.location.search)).get('to') ?? '';
    if (name.length == 0) {
        document.getElementById('namatamu').remove();
    } 
	else {
		let div = document.createElement('div');
        div.classList.add('m-2');
        div.innerHTML = `
        <p style="" class="mt-0 mb-1 mx-0 p-0 ">Kepada Yth Bapak/Ibu/Saudara/i</p>
        <h2 style="" >${escapeHtml(name)}</h2>
        `;

        document.getElementById('formnama').value = name;
        document.getElementById('namatamu').appendChild(div);
	}

    modal.show();
    opacity();
}, false);

