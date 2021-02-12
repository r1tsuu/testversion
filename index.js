const io = require('socket.io-client');

const axios = require('axios')

let getRequestConfig = (login, password) => ({
    method: 'post',
    url: 'https://dota2.ru/forum/api/user/auth',
    data: {
        login: login,
        password: password,
        refer: 'https://dota2.ru/',
        remember: true,
        silent: false
    },
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
})

let auth = async (login, password) => {
    try {
        let response = await axios(getRequestConfig(login, password))
        return {
            status: response.data.status,
            cookie: response.headers['set-cookie'][1] // возвращает forum_auth куки, нулевой индекс - cl_session, с ним тоже не работает
        }
    } catch (error) {
        console.log(error);
    }
}

// main func
( async() => {
    let res = await auth('testoviy chelik', '123456');
    console.log('xd')
    if (res.status !=='success') {
        return;
    }
    const socket = io('https://dota2.ru', {
        reconnectionAttemps: 10,
        reconnectionDelay: 5e3,
        extraHeaders: {
            Cookie: res.cookie
        }
    })
    console.log(res)
    socket.on('connect', () => console.log("connected"));
    socket.on('notification', (data) => console.log(data));
})()